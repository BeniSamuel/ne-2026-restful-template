import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { Roles } from 'src/security/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Maintenance')
@ApiBearerAuth()
export class MaintenanceController {
  constructor(
    @Inject('MAINTENANCE_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.INSPECTOR)
  create(@Body() body: any) {
    return firstValueFrom(this.client.send({ cmd: 'create-maintenance' }, body));
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSPECTOR)
  findAll(@Query() query: any) {
    return firstValueFrom(this.client.send({ cmd: 'get-maintenance' }, query));
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSPECTOR)
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.client.send({ cmd: 'get-maintenance-by-id' }, { id }));
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.INSPECTOR)
  update(@Param('id') id: string, @Body() data: any) {
    return firstValueFrom(this.client.send({ cmd: 'update-maintenance' }, { id, data }));
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.INSPECTOR)
  remove(@Param('id') id: string) {
    return firstValueFrom(this.client.send({ cmd: 'delete-maintenance' }, { id }));
  }
}
