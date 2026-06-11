import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from 'src/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { SetupPasswordDto } from 'src/dto/setup-password.dto';

@Controller('api/v1/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiBody({
    type: LoginDto,
    examples: {
      admin: {
        summary: 'Admin login',
        value: {
          email: 'admin@tzw.test',
          password: 'Admin123!',
        },
      },
      inspector: {
        summary: 'Inspector login',
        value: {
          email: 'inspector@tzw.test',
          password: 'Inspector123!',
        },
      },
      user: {
        summary: 'User login',
        value: {
          email: 'user@tzw.test',
          password: 'User123!',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const response = await firstValueFrom(
      this.authService.send({ cmd: 'login-user' }, loginDto),
    );
    return response.data ?? response;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      user: {
        summary: 'Register user',
        value: {
          firstName: 'Facility',
          lastName: 'Officer',
          email: 'facility@tzw.test',
          password: 'Facility123!',
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    const response = await firstValueFrom(
      this.authService.send({ cmd: 'register-user' }, registerDto),
    );
    return response.data ?? response;
  }

  @Post('logout')
  async logout() {
    return firstValueFrom(this.authService.send({ cmd: 'logout' }, {}));
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Generate password reset token and email instructions' })
  @ApiBody({
    type: ForgotPasswordDto,
    examples: {
      admin: {
        summary: 'Request reset for admin',
        value: { email: 'admin@tzw.test' },
      },
    },
  })
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return firstValueFrom(this.authService.send({ cmd: 'forgot-password' }, payload));
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with reset token' })
  @ApiBody({
    type: ResetPasswordDto,
    examples: {
      reset: {
        summary: 'Reset password',
        value: {
          token: 'paste-reset-token-here',
          newPassword: 'NewAdmin123!',
        },
      },
    },
  })
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return firstValueFrom(this.authService.send({ cmd: 'reset-password' }, payload));
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password using current password' })
  @ApiBody({
    type: ChangePasswordDto,
    examples: {
      admin: {
        summary: 'Change admin password',
        value: {
          email: 'admin@tzw.test',
          currentPassword: 'Admin123!',
          newPassword: 'NewAdmin123!',
        },
      },
    },
  })
  async changePassword(@Body() payload: ChangePasswordDto) {
    return firstValueFrom(this.authService.send({ cmd: 'change-password' }, payload));
  }

  @Post('setup-password')
  @ApiOperation({ summary: 'Set password for invited inactive inspector account' })
  @ApiBody({
    type: SetupPasswordDto,
    examples: {
      setup: {
        summary: 'Setup inspector password',
        value: {
          token: 'paste-invitation-token-here',
          password: 'Inspector123!',
          confirmPassword: 'Inspector123!',
        },
      },
    },
  })
  async setupPassword(@Body() payload: SetupPasswordDto) {
    return firstValueFrom(this.authService.send({ cmd: 'setup-password' }, payload));
  }
}
