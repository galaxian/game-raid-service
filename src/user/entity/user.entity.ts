import { DefaultEntity } from 'src/utils/entity/default.entity';
import { Entity } from 'typeorm';

@Entity()
export class User extends DefaultEntity {}
