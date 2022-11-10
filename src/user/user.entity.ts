import { ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class user {
  @PrimaryGeneratedColumn()
  id: string;

  name: string;

  email: string;
}
