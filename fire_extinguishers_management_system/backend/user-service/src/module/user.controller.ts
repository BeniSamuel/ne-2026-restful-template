import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Users } from 'src/model/user.model';
import { UserService } from './user.service';
import { ApiResponse } from 'src/utils/response.util';
import { CreateUserDto } from 'src/dto/request/create-user.dto';
import { ResponseUserDto } from 'src/dto/response/response-user.dto';
import { UpdateUserDto } from 'src/dto/request/update-user.dto';
import { CreateInspectorDto } from 'src/dto/request/create-inspector.dto';
import { SetupPasswordDto } from 'src/dto/request/setup-password.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get-users' })
  async getAllUsers(): Promise<ApiResponse<Users[]>> {
    return this.userService.getAllUsers();
  }

  @MessagePattern({ cmd: 'get-user-by-uuid' })
  getUserById(@Payload() data: { uuid: string }): Promise<ApiResponse<Users>> {
    return this.userService.getUserById(data.uuid);
  }

  @MessagePattern({ cmd: 'get-user-by-email' })
  getUserByEmail(
    @Payload() data: { email: string },
  ): Promise<ApiResponse<Users>> {
    return this.userService.getUserByEmail(data.email);
  }

  @MessagePattern({ cmd: 'create-user' })
  createUser(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<any>> {
    return this.userService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: 'create-inspector' })
  createInspector(
    @Payload() createInspectorDto: CreateInspectorDto,
  ): Promise<ApiResponse<any>> {
    return this.userService.createInspector(createInspectorDto);
  }

  @MessagePattern({ cmd: 'setup-password' })
  setupPassword(
    @Payload() setupPasswordDto: SetupPasswordDto,
  ): Promise<ApiResponse<any>> {
    return this.userService.setupPassword(setupPasswordDto);
  }

  @MessagePattern({ cmd: 'update-user-by-id' })
  updateUserById(
    @Payload() data: { id: string; updateUserDto: UpdateUserDto },
  ): Promise<ApiResponse<ResponseUserDto>> {
    return this.userService.updateUserById(data.id, data.updateUserDto);
  }

  @MessagePattern({ cmd: 'update-user-password' })
  updateUserPassword(
    @Payload() data: { id: string; password: string },
  ): Promise<ApiResponse<ResponseUserDto>> {
    return this.userService.updateUserById(data.id, { password: data.password });
  }

  @MessagePattern({ cmd: 'delete-user-by-id' })
  deleteUserById(
    @Payload() data: { id: string },
  ): Promise<ApiResponse<Boolean>> {
    return this.userService.deleteUserById(data.id);
  }
}
