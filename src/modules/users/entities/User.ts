import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import Comics from '@modules/comics/entities/Comics';
import Characters from '@modules/characters/entities/Characters';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: true })
  avatar: string | null;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(type => Characters, { cascade: true })
  @JoinTable({
    name: 'users_characters',
    joinColumn: {
      name: 'user_id'
    },
    inverseJoinColumn: {
      name: 'character_id'
    }
  })
  characters: Characters[];

  @ManyToMany(type => Comics, { cascade: true })
  @JoinTable({
    name: 'users_comics',
    joinColumn: {
      name: 'user_id'
    },
    inverseJoinColumn: {
      name: 'comic_id'
    }
  })
  comics: Comics[];

  @Column('boolean', { name: 'active' })
  active = true;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
