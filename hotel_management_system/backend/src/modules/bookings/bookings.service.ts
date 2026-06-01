import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from 'src/dtos/create-booking.dto';
import { UpdateBookingDto } from 'src/dtos/update-booking.dto';
import { Booking } from 'src/entities/booking.entity';
import { Hotel } from 'src/entities/hotel.entity';
import { User } from 'src/entities/user.entity';
import { BookingStatus } from 'src/enums/booking-status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    this.validateDates(
      createBookingDto.checkInDate,
      createBookingDto.checkOutDate,
    );

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const hotel = await this.hotelRepository.findOne({
      where: { id: createBookingDto.hotelId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    const booking = this.bookingRepository.create({
      user,
      hotel,
      checkInDate: createBookingDto.checkInDate,
      checkOutDate: createBookingDto.checkOutDate,
    });

    return this.bookingRepository.save(booking);
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ order: { id: 'DESC' } });
  }

  findMine(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    const checkInDate = updateBookingDto.checkInDate || booking.checkInDate;
    const checkOutDate = updateBookingDto.checkOutDate || booking.checkOutDate;

    this.validateDates(checkInDate, checkOutDate);

    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async checkOut(id: number): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cancelled bookings cannot be checked out');
    }

    booking.status = BookingStatus.CHECKED_OUT;
    booking.checkOutDate = new Date();
    return this.bookingRepository.save(booking);
  }

  async cancel(id: number): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CHECKED_OUT) {
      throw new BadRequestException('Checked-out bookings cannot be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  async remove(id: number): Promise<{ message: string }> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
    return { message: 'Booking deleted permanently' };
  }

  private validateDates(checkInDate: Date, checkOutDate: Date): void {
    if (checkOutDate <= checkInDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }
  }
}
