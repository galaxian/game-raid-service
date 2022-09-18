import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.raidRecord, { eager: false })
  user: User;

  @DeleteDateColumn()
  deleteAt: Date;
}
