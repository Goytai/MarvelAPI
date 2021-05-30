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

  @Column('varchar', { nullable: true })
  description: string | null | undefined;

  @Column('varchar', { nullable: true })
  picture: string | null | undefined;

  @Column('boolean', { name: 'active' })
  active = true;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
