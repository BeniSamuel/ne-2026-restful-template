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

@Controller('api/v1/extinguishers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Extinguishers')
@ApiBearerAuth()
export class ExtinguishersController {
  constructor(
    @Inject('EXTINGUISHER_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: any) {
    return firstValueFrom(this.client.send({ cmd: 'create-extinguisher' }, body));
  }

  @Get()
  findAll(@Query() query: any) {
    return firstValueFrom(this.client.send({ cmd: 'get-extinguishers' }, query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.client.send({ cmd: 'get-extinguisher-by-id' }, { id }));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return firstValueFrom(this.client.send({ cmd: 'update-extinguisher' }, { id, data }));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return firstValueFrom(this.client.send({ cmd: 'delete-extinguisher' }, { id }));
  }
}
