import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { usersRole } from "../enum/users.enum";

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  matricule: string;

  @IsOptional()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  firstname: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  salt: string;

  @IsOptional()
  @IsString()
  mobile: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsOptional()
  @IsString()
  complement: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  postal: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsEnum(usersRole)
  role: number;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isValidatedEmail: boolean;
  
}
