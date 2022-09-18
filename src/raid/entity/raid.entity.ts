import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RaidRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  level: number;

  @CreateDateColumn()
  enterTime: Date;

  @UpdateDateColumn()
  endTime: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
