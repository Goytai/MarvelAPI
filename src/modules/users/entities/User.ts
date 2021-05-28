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
import Charapters from '@modules/characters/entities/Characters';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  avatar: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(type => Charapters)
  @JoinTable({
    name: 'users_characters',
    joinColumn: {
      name: 'user_id'
    },
    inverseJoinColumn: {
      name: 'character_id'
    }
  })
  characteres: Charapters[];

  @ManyToMany(type => Comics)
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

  @Column('boolean')
  active: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
