import { Role } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;

  @Column({ type: 'varchar', nullable: true })
  setupTokenHash?: string;

  @Column({ type: 'timestamp', nullable: true })
  setupTokenExpiresAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  setupTokenUsedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    role: Role = Role.USER,
    accountStatus: AccountStatus = AccountStatus.ACTIVE,
  ) {
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (email) this.email = email;
    if (password) this.password = password;
    this.role = role;
    this.accountStatus = accountStatus;
  }
}
