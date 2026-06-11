import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from 'src/dto/login.dto';
import { Role } from 'src/enums/role.enums';
import { ApiResponse } from 'src/utils/response.util';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/dto/register.dto';
import { ForgotPasswordDto } from 'src/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import * as nodemailer from 'nodemailer';
import type { StringValue } from 'ms';
import { CreateInspectorDto } from 'src/dto/create-inspector.dto';
import { SetupPasswordDto } from 'src/dto/setup-password.dto';
import { randomBytes, createHash } from 'crypto';

type UserInform = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  accountStatus?: 'ACTIVE' | 'INACTIVE';
};

type ResetTokenPayload = {
  sub: string;
  email: string;
  purpose: 'password-reset';
};

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginDto): Promise<ApiResponse<any>> {
    const user = await this.getUserByEmail(loginUserDto.email);

    if (!user?.email) {
      return ApiResponse.badRequest('Invalid email', null);
    }

    if (user.accountStatus === 'INACTIVE') {
      return ApiResponse.badRequest('Account is inactive. Complete password setup first.', null);
    }

    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatches) {
      return ApiResponse.badRequest('Invalid password', null);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return ApiResponse.ok('Successfully logged in user!!!', {
      accessToken: this.jwtService.sign(payload),
      user: this.toSafeUser(user),
    });
  }

  async createUser(registerDto: RegisterDto): Promise<ApiResponse<any>> {
    const { data }: { data: UserInform } = await firstValueFrom(
      this.userService.send({ cmd: 'create-user' }, registerDto),
    );

    if (!data) {
      return ApiResponse.badRequest('User registration failed', null);
    }

    return ApiResponse.created('User created successfully', this.toSafeUser(data));
  }

  async createInspector(payload: CreateInspectorDto): Promise<ApiResponse<any>> {
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const temporaryPassword = this.generateTemporaryPassword();
    const expiresAt = new Date(
      Date.now() + Number(process.env.SETUP_TOKEN_TTL_MINUTES ?? 60) * 60 * 1000,
    );

    const response = await firstValueFrom(
      this.userService.send(
        { cmd: 'create-inspector' },
        {
          ...payload,
          setupTokenHash: tokenHash,
          setupTokenExpiresAt: expiresAt.toISOString(),
          temporaryPassword,
        },
      ),
    );

    if (!response.success) {
      return response;
    }

    const setupUrl = `${process.env.PASSWORD_SETUP_BASE_URL ?? 'http://localhost:5173/create-password'}?token=${token}`;
    const emailResult = await this.sendInspectorInvitationEmail(
      payload,
      setupUrl,
      expiresAt,
      temporaryPassword,
    );

    return ApiResponse.created('Inspector invitation created successfully', {
      inspector: response.data,
      setupUrl,
      setupToken: token,
      temporaryPassword,
      expiresAt,
      emailSent: emailResult.sent,
      emailMessage: emailResult.message,
    });
  }

  logout(): ApiResponse<null> {
    return ApiResponse.ok('Logged out successfully', null);
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<ApiResponse<any>> {
    const user = await this.getUserByEmail(payload.email);

    if (!user?.email) {
      return ApiResponse.ok(
        'If that email exists, password reset instructions were generated',
        null,
      );
    }

    const resetToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        purpose: 'password-reset',
      },
      {
        expiresIn: (process.env.RESET_TOKEN_EXPIRES_IN ?? '15m') as StringValue,
      },
    );

    const resetUrl = `${process.env.PASSWORD_RESET_BASE_URL ?? 'http://127.0.0.1:5173/create-password'}?token=${resetToken}`;
    const emailResult = await this.sendPasswordResetEmail(user, resetUrl, resetToken);

    return ApiResponse.ok('Password reset instructions generated', {
      email: user.email,
      resetUrl,
      resetToken,
      emailSent: emailResult.sent,
      emailMessage: emailResult.message,
    });
  }

  async resetPassword(payload: ResetPasswordDto): Promise<ApiResponse<any>> {
    let decoded: ResetTokenPayload;
    try {
      decoded = this.jwtService.verify(payload.token, {
        secret: process.env.JWT_SECRET_KEY ?? 'fire-exam-secret',
      }) as ResetTokenPayload;
    } catch {
      return ApiResponse.badRequest('Invalid or expired reset token', null);
    }

    if (decoded.purpose !== 'password-reset') {
      return ApiResponse.badRequest('Invalid reset token purpose', null);
    }

    const response = await firstValueFrom(
      this.userService.send(
        { cmd: 'update-user-password' },
        { id: decoded.sub, password: payload.newPassword },
      ),
    );

    return ApiResponse.ok('Password reset successfully', response.data);
  }

  async changePassword(payload: ChangePasswordDto): Promise<ApiResponse<any>> {
    const user = await this.getUserByEmail(payload.email);

    if (!user?.email) {
      return ApiResponse.badRequest('Invalid email', null);
    }

    const passwordMatches = await bcrypt.compare(
      payload.currentPassword,
      user.password,
    );
    if (!passwordMatches) {
      return ApiResponse.badRequest('Invalid current password', null);
    }

    const response = await firstValueFrom(
      this.userService.send(
        { cmd: 'update-user-password' },
        { id: user.id, password: payload.newPassword },
      ),
    );

    return ApiResponse.ok('Password changed successfully', response.data);
  }

  async setupPassword(payload: SetupPasswordDto): Promise<ApiResponse<any>> {
    if (payload.password !== payload.confirmPassword) {
      return ApiResponse.badRequest('Password and confirmPassword do not match', null);
    }

    const response = await firstValueFrom(
      this.userService.send(
        { cmd: 'setup-password' },
        {
          tokenHash: this.hashToken(payload.token),
          password: payload.password,
        },
      ),
    );

    return response;
  }

  private async getUserByEmail(email: string): Promise<UserInform | null> {
    const { data }: { data: UserInform } = await firstValueFrom(
      this.userService.send({ cmd: 'get-user-by-email' }, { email }),
    );
    return data ?? null;
  }

  private toSafeUser(user: UserInform) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateTemporaryPassword(): string {
    return `Inspector${randomBytes(4).toString('hex')}!`;
  }

  private async sendPasswordResetEmail(
    user: UserInform,
    resetUrl: string,
    resetToken: string,
  ): Promise<{ sent: boolean; message: string }> {
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_APP_PASSWORD;

    if (!mailUser || !mailPassword) {
      return {
        sent: false,
        message:
          'MAIL_USER or MAIL_APP_PASSWORD is missing. Use resetToken from response for local testing.',
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mailUser,
          pass: mailPassword,
        },
      });

      await transporter.sendMail({
        from: `"TZW Safety" <${mailUser}>`,
        to: user.email,
        subject: 'TZW Safety password reset',
        text: `Use this link to reset your password: ${resetUrl}\n\nToken: ${resetToken}`,
        html: `
          <p>Hello ${user.firstName},</p>
          <p>Use the link below to reset your TZW Safety password.</p>
          <p><a href="${resetUrl}">Reset password</a></p>
          <p>If the link does not work, use this token in Swagger/Postman:</p>
          <pre>${resetToken}</pre>
        `,
      });

      return { sent: true, message: 'Password reset email sent' };
    } catch (error) {
      return {
        sent: false,
        message: `Email failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      };
    }
  }

  private async sendInspectorInvitationEmail(
    inspector: CreateInspectorDto,
    setupUrl: string,
    expiresAt: Date,
    temporaryPassword: string,
  ): Promise<{ sent: boolean; message: string }> {
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_APP_PASSWORD;

    if (!mailUser || !mailPassword) {
      return {
        sent: false,
        message:
          'MAIL_USER or MAIL_APP_PASSWORD is missing. Use setupToken from response for local testing.',
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mailUser,
          pass: mailPassword,
        },
      });

      await transporter.sendMail({
        from: `"TZW Safety" <${mailUser}>`,
        to: inspector.email,
        subject: 'TZW Safety inspector account invitation',
        text: `Welcome ${inspector.firstName}. Your inspector account is ready.\n\nEmail: ${inspector.email}\nTemporary password: ${temporaryPassword}\n\nYou can log in with this password now and change it later.\n\nOptional password setup link: ${setupUrl}\nThis link expires at ${expiresAt.toLocaleString()}.`,
        html: `
          <p>Hello ${inspector.firstName},</p>
          <p>Welcome to TZW Safety. An administrator created an inspector account for you.</p>
          <p>You can log in now using these temporary credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${inspector.email}</li>
            <li><strong>Temporary password:</strong> ${temporaryPassword}</li>
          </ul>
          <p>Please change this password after logging in.</p>
          <p>If you prefer, you can also use the secure link below to set your password:</p>
          <p><a href="${setupUrl}">Set up inspector password</a></p>
          <p>This invitation expires at <strong>${expiresAt.toLocaleString()}</strong>.</p>
          <p>If you did not expect this invitation, ignore this email.</p>
        `,
      });

      return { sent: true, message: 'Inspector invitation email sent' };
    } catch (error) {
      return {
        sent: false,
        message: `Email failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      };
    }
  }
}
