import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  nick_name: string;

  @Column()
  provider: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;
}
