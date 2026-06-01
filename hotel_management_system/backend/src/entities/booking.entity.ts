import { Hotel } from 'src/entities/hotel.entity';
import { User } from 'src/entities/user.entity';
import { BookingStatus } from 'src/enums/booking-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => Hotel, (hotel) => hotel.bookings, { eager: true })
  hotel: Hotel;

  @Column({ type: 'timestamp' })
  checkInDate: Date;

  @Column({ type: 'timestamp' })
  checkOutDate: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.ACTIVE })
  status: BookingStatus;

  @Column({ default: false })
  reportGenerated: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
