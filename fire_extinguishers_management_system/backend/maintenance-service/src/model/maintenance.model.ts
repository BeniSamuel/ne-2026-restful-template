import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenance')
export class Maintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  extinguisherId: string;

  @Column()
  inspectorId: string;

  @Column({ type: 'text' })
  actionTaken: string;

  @Column({ type: 'text' })
  conditionNoted: string;

  @Column({ type: 'timestamp' })
  actionDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
