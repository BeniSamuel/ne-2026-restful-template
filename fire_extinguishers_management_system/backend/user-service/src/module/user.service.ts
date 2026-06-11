import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/request/create-user.dto';
import { UpdateUserDto } from 'src/dto/request/update-user.dto';
import { ResponseUserDto } from 'src/dto/response/response-user.dto';
import { AccountStatus, Users } from 'src/model/user.model';
import { ApiResponse } from 'src/utils/response.util';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';
import { CreateInspectorDto } from 'src/dto/request/create-inspector.dto';
import { SetupPasswordDto } from 'src/dto/request/setup-password.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async onModuleInit() {
    await this.seedDemoUsers();
  }

  async getAllUsers(): Promise<ApiResponse<any[]>> {
    return ApiResponse.ok(
      'Users obtained successfully!!!',
      (await this.userRepository.find({ order: { createdAt: 'DESC' } })).map(
        (user) => this.toSafeUser(user),
      ),
    );
  }

  async getUserById(id: string): Promise<ApiResponse<any>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user == null) {
      return ApiResponse.notFound('Failed to obtain user!!!', null);
    }
    return ApiResponse.ok('User obtained successfully!!!', this.toSafeUser(user));
  }

  async getUserByEmail(email: string): Promise<ApiResponse<Users>> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user != null) {
      return ApiResponse.ok('User obtained successfully!!!', user);
    }
    return ApiResponse.notFound('Failed to obtain user!!!', null);
  }

  async createUser(createUserDto: CreateUserDto): Promise<ApiResponse<any>> {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user != null) {
      return ApiResponse.badRequest('User with email already exists!!!', null);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const savedUser = await this.userRepository.save(
      new Users(
        createUserDto.firstName,
        createUserDto.lastName,
        createUserDto.email,
        hashedPassword,
        Role.USER,
        AccountStatus.ACTIVE,
      ),
    );

    return ApiResponse.created(
      'Successfully created a user!!!',
      this.toSafeUser(savedUser),
    );
  }

  async createInspector(
    createInspectorDto: CreateInspectorDto,
  ): Promise<ApiResponse<any>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createInspectorDto.email },
    });

    if (existingUser != null) {
      return ApiResponse.badRequest('User with email already exists!!!', null);
    }

    const temporaryPassword = await bcrypt.hash(
      createInspectorDto.temporaryPassword,
      10,
    );
    const inspector = new Users(
      createInspectorDto.firstName,
      createInspectorDto.lastName,
      createInspectorDto.email,
      temporaryPassword,
      Role.INSPECTOR,
      AccountStatus.ACTIVE,
    );
    inspector.setupTokenHash = createInspectorDto.setupTokenHash;
    inspector.setupTokenExpiresAt = new Date(createInspectorDto.setupTokenExpiresAt);
    inspector.setupTokenUsedAt = null;

    const savedInspector = await this.userRepository.save(inspector);
    return ApiResponse.created(
      'Inspector invitation created successfully',
      this.toSafeUser(savedInspector),
    );
  }

  async setupPassword(
    setupPasswordDto: SetupPasswordDto,
  ): Promise<ApiResponse<any>> {
    const user = await this.userRepository.findOne({
      where: { setupTokenHash: setupPasswordDto.tokenHash },
    });

    if (!user) {
      return ApiResponse.badRequest('Invalid setup token', null);
    }

    if (user.setupTokenUsedAt) {
      return ApiResponse.badRequest('Setup token already used', null);
    }

    if (!user.setupTokenExpiresAt || user.setupTokenExpiresAt.getTime() < Date.now()) {
      return ApiResponse.badRequest('Setup token has expired', null);
    }

    user.password = await bcrypt.hash(setupPasswordDto.password, 10);
    user.accountStatus = AccountStatus.ACTIVE;
    user.setupTokenUsedAt = new Date();

    const savedUser = await this.userRepository.save(user);
    return ApiResponse.ok('Password setup completed successfully', this.toSafeUser(savedUser));
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<ResponseUserDto>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user == null) {
      return ApiResponse.notFound('User not found!!!', null);
    }

    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await this.userRepository.save(user);
    return ApiResponse.ok(
      'Successfully updated user!!!',
      new ResponseUserDto(
        user.firstName,
        user.lastName,
        user.email,
        user.id,
        user.role,
      ),
    );
  }

  async deleteUserById(id: string): Promise<ApiResponse<boolean>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user == null) {
      return ApiResponse.notFound('User not found!!!', false);
    }
    await this.userRepository.delete(user);
    return ApiResponse.ok('Successfully deleted user!!!', true);
  }

  private async seedDemoUsers() {
    const count = await this.userRepository.count();
    if (count > 0) return;

    const demoUsers = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@tzw.test',
        password: 'Admin123!',
        role: 'ADMIN',
        accountStatus: AccountStatus.ACTIVE,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        firstName: 'Field',
        lastName: 'Inspector',
        email: 'inspector@tzw.test',
        password: 'Inspector123!',
        role: 'INSPECTOR',
        accountStatus: AccountStatus.ACTIVE,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        firstName: 'Facility',
        lastName: 'User',
        email: 'user@tzw.test',
        password: 'User123!',
        role: 'USER',
        accountStatus: AccountStatus.ACTIVE,
      },
    ];

    for (const demoUser of demoUsers) {
      const user = new Users(
        demoUser.firstName,
        demoUser.lastName,
        demoUser.email,
        await bcrypt.hash(demoUser.password, 10),
        demoUser.role as any,
        demoUser.accountStatus,
      );
      user.id = demoUser.id;
      await this.userRepository.save(user);
    }
  }

  private toSafeUser(user: Users) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
