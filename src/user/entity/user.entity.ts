import { RaidRecord } from 'src/raid/entity/raid.entity';
import { DefaultEntity } from 'src/utils/entity/default.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends DefaultEntity {
  @OneToMany(() => RaidRecord, (raidRecord) => raidRecord.user, {
    eager: false,
  })
  raidRecord: RaidRecord[];
}
