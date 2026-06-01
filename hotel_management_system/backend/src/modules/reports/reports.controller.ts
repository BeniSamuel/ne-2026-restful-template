import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateReportDto } from 'src/dtos/create-report.dto';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { TokenGuard } from 'src/guards/token.guard';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(TokenGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get generated reports. Admin only' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a report manually. Admin only' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  generate(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.generateManualReport(createReportDto);
  }
}
