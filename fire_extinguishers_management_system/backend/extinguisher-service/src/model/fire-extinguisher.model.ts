import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ExtinguisherType {
  WATER = 'WATER',
  CARBON_DIOXIDE = 'CARBON_DIOXIDE',
  FOAM = 'FOAM',
  DRY_CHEMICAL = 'DRY_CHEMICAL',
}

export enum ExtinguisherSize {
  TWO_POINT_FIVE_LBS = '2.5_LBS',
  FIVE_LBS = '5_LBS',
  NINE_LBS = '9_LBS',
  TWELVE_LBS = '12_LBS',
}

export enum ExtinguisherStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

@Entity('fire_extinguishers')
export class FireExtinguisher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  serialNumber: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: ExtinguisherType })
  type: ExtinguisherType;

  @Column({ type: 'enum', enum: ExtinguisherSize })
  size: ExtinguisherSize;

  @Column({ type: 'date' })
  installationDate: string;

  @Column({ type: 'date' })
  expiryDate: string;

  @Column({
    type: 'enum',
    enum: ExtinguisherStatus,
    default: ExtinguisherStatus.ACTIVE,
  })
  status: ExtinguisherStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
