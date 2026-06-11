import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateInspectorDto } from './dtos/create-inspector.dto';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { Roles } from 'src/security/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return firstValueFrom(this.userService.send({ cmd: 'create-user' }, createUserDto));
  }

  @Post('create-inspector')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create inactive inspector account and send setup email' })
  @ApiBody({ type: CreateInspectorDto })
  async createInspector(@Body() createInspectorDto: CreateInspectorDto) {
    return firstValueFrom(
      this.authService.send({ cmd: 'create-inspector' }, createInspectorDto),
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return firstValueFrom(this.userService.send({ cmd: 'get-users' }, {}));
  }

  @Get('profile')
  async getProfile() {
    return { message: 'Use the authenticated user from the JWT in the final guard flow.' };
  }

  @Put('profile')
  async updateProfile(@Body() updateUserDto: UpdateUserDto) {
    return { message: 'Profile update requires JWT guard wiring.', data: updateUserDto };
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async getUserById(@Param('id') id: string) {
    return firstValueFrom(
      this.userService.send({ cmd: 'get-user-by-uuid' }, { uuid: id }),
    );
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return firstValueFrom(
      this.userService.send(
        { cmd: 'update-user-by-id' },
        { id, updateUserDto },
      ),
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteUserById(@Param('id') id: string) {
    return firstValueFrom(
      this.userService.send({ cmd: 'delete-user-by-id' }, { id }),
    );
  }
}
