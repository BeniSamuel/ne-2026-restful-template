import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/enums/role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    return this.createWithRole(registerUserDto, Role.CLIENT);
  }

  async createAdminIfMissing(): Promise<User> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hotel.test';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const firstName = process.env.ADMIN_FIRST_NAME || 'Hotel';
    const lastName = process.env.ADMIN_LAST_NAME || 'Admin';

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      existingAdmin.role = Role.ADMIN;
      existingAdmin.firstName = firstName;
      existingAdmin.lastName = lastName;
      existingAdmin.password = await bcrypt.hash(adminPassword, 10);
      return this.userRepository.save(existingAdmin);
    }

    return this.createWithRole(
      {
        email: adminEmail,
        firstName,
        lastName,
        password: adminPassword,
      },
      Role.ADMIN,
    );
  }

  private async createWithRole(
    registerUserDto: RegisterUserDto,
    role: Role,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create({
      ...registerUserDto,
      role,
      password: await bcrypt.hash(registerUserDto.password, 10),
    });

    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  removePassword(user: User): Omit<User, 'password'> {
    const safeUser = { ...user };
    delete safeUser.password;
    return safeUser;
  }
}
