import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateBookingDto } from 'src/dtos/create-booking.dto';
import { UpdateBookingDto } from 'src/dtos/update-booking.dto';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthRequest, TokenGuard } from 'src/guards/token.guard';
import { BookingsService } from './bookings.service';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(TokenGuard, RoleGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking for the logged-in user' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  create(
    @Req() request: AuthRequest,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(request.user.sub, createBookingDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all bookings. Admin only' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get bookings for the logged-in user' })
  findMine(@Req() request: AuthRequest) {
    return this.bookingsService.findMine(request.user.sub);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get one booking. Admin only' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update booking dates. Admin only' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/check-out')
  @ApiOperation({ summary: 'Check out from a hotel booking' })
  checkOut(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.checkOut(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.cancel(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete one booking permanently. Admin only' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}
