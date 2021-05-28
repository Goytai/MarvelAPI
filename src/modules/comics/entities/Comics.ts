import Charapters from '@modules/characters/entities/Characters';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('comics')
export default class Comics {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('bigint')
  marvel_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  picture: string;

  @Column('boolean')
  active: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
