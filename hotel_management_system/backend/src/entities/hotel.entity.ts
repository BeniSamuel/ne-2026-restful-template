import { Availability } from 'src/enums/availability.enum';
import { Booking } from 'src/entities/booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ default: 1 })
  rooms: number;

  @Column({ type: 'enum', enum: Availability, default: Availability.AVAILABLE })
  availability: Availability;

  @OneToMany(() => Booking, (booking) => booking.hotel)
  bookings: Booking[];
}
