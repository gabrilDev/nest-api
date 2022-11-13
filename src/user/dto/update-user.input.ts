import { InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  // eslint-disable-next-line prettier/prettier
  IsString
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @IsOptional()
  password?: string;

  @IsDate()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @IsOptional()
  birth?: string;
}
