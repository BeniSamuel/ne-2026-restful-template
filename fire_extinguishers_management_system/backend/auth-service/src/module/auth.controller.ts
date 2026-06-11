import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { ForgotPasswordDto } from 'src/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { CreateInspectorDto } from 'src/dto/create-inspector.dto';
import { SetupPasswordDto } from 'src/dto/setup-password.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login-user' })
  handleLogin(@Payload() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @MessagePattern({ cmd: 'register-user' })
  handleSignup(@Payload() registerDto: RegisterDto) {
    return this.authService.createUser(registerDto);
  }

  @MessagePattern({ cmd: 'create-inspector' })
  handleCreateInspector(@Payload() payload: CreateInspectorDto) {
    return this.authService.createInspector(payload);
  }

  @MessagePattern({ cmd: 'logout' })
  handleLogout() {
    return this.authService.logout();
  }

  @MessagePattern({ cmd: 'forgot-password' })
  handleForgotPassword(@Payload() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }

  @MessagePattern({ cmd: 'reset-password' })
  handleResetPassword(@Payload() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload);
  }

  @MessagePattern({ cmd: 'change-password' })
  handleChangePassword(@Payload() payload: ChangePasswordDto) {
    return this.authService.changePassword(payload);
  }

  @MessagePattern({ cmd: 'setup-password' })
  handleSetupPassword(@Payload() payload: SetupPasswordDto) {
    return this.authService.setupPassword(payload);
  }
}
