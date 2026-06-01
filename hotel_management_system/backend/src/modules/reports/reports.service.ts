import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from 'src/dtos/create-report.dto';
import { Booking } from 'src/entities/booking.entity';
import { Report } from 'src/entities/report.entity';
import { BookingStatus } from 'src/enums/booking-status.enum';
import { Between, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  findAll(): Promise<Report[]> {
    return this.reportRepository.find({ order: { id: 'DESC' } });
  }

  async generateManualReport(
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    const bookings = await this.bookingRepository.find({
      where: {
        checkOutDate: Between(
          createReportDto.periodStart,
          createReportDto.periodEnd,
        ),
      },
    });

    const checkedOutBookings = bookings.filter(
      (booking) => booking.status === BookingStatus.CHECKED_OUT,
    );

    return this.reportRepository.save({
      periodStart: createReportDto.periodStart,
      periodEnd: createReportDto.periodEnd,
      totalBookings: bookings.length,
      totalCheckedOutBookings: checkedOutBookings.length,
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async generateCheckoutReport(): Promise<Report | null> {
    const now = new Date();

    await this.markExpiredBookingsAsCheckedOut(now);

    const bookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.CHECKED_OUT,
        reportGenerated: false,
        checkOutDate: LessThanOrEqual(now),
      },
      order: { checkOutDate: 'ASC' },
    });

    if (bookings.length === 0) {
      return null;
    }

    const report = await this.reportRepository.save({
      periodStart: bookings[0].checkOutDate,
      periodEnd: now,
      totalBookings: bookings.length,
      totalCheckedOutBookings: bookings.length,
    });

    await this.bookingRepository.save(
      bookings.map((booking) => ({
        ...booking,
        reportGenerated: true,
      })),
    );

    return report;
  }

  private async markExpiredBookingsAsCheckedOut(now: Date): Promise<void> {
    const expiredBookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.ACTIVE,
        checkOutDate: LessThanOrEqual(now),
      },
    });

    if (expiredBookings.length === 0) {
      return;
    }

    await this.bookingRepository.save(
      expiredBookings.map((booking) => ({
        ...booking,
        status: BookingStatus.CHECKED_OUT,
      })),
    );
  }
}
