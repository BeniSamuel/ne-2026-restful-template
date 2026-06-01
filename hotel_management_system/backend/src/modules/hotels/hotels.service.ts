import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHotelDto } from 'src/dtos/create-hotel.dto';
import { UpdateHotelDto } from 'src/dtos/update-hotel.dto';
import { Hotel } from 'src/entities/hotel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepository.create(createHotelDto);
    return this.hotelRepository.save(hotel);
  }

  async seedDefaults(): Promise<void> {
    const count = await this.hotelRepository.count();

    if (count > 0) {
      return;
    }

    await this.hotelRepository.save([
      { name: 'Kigali View Hotel', location: 'Kigali', rooms: 18 },
      { name: 'Exam Demo Lodge', location: 'Musanze', rooms: 10 },
      { name: 'Lake Side Resort', location: 'Rubavu', rooms: 14 },
    ]);
  }

  findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find();
  }

  async findOne(id: number): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({ where: { id } });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async update(id: number, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const hotel = await this.findOne(id);
    Object.assign(hotel, updateHotelDto);
    return this.hotelRepository.save(hotel);
  }

  async remove(id: number): Promise<{ message: string }> {
    const hotel = await this.findOne(id);
    await this.hotelRepository.remove(hotel);
    return { message: 'Hotel deleted successfully' };
  }
}
