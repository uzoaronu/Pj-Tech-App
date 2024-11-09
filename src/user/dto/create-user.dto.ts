import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  role: string; //Enum of SELLER, USER, ADMIN

  @IsString()
  password: string;

  @IsString()
  address: String;

  @IsInt()
  age: number;

  @IsInt()
  Phone: number;
}
