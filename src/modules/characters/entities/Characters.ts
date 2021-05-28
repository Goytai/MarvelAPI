import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('characters')
export default class Charapters {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('bigint')
  marvel_id: number;

  @Column()
  name: string;

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
