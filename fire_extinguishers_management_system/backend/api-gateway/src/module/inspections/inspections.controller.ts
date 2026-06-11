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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Inspections')
@ApiBearerAuth()
export class InspectionsController {
  constructor(
    @Inject('INSPECTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() body: any) {
    return firstValueFrom(this.client.send({ cmd: 'create-inspection' }, body));
  }

  @Get()
  findAll(@Query() query: any) {
    return firstValueFrom(this.client.send({ cmd: 'get-inspections' }, query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.client.send({ cmd: 'get-inspection-by-id' }, { id }));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return firstValueFrom(this.client.send({ cmd: 'update-inspection' }, { id, data }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return firstValueFrom(this.client.send({ cmd: 'delete-inspection' }, { id }));
  }
}
