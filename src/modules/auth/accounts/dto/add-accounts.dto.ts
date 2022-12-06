import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { companyStatus, currency } from "../enum/accounts.enum";

export class AddAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  division?: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  postal: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  companyMatricule?: string;

  @IsOptional()
  @IsEnum(companyStatus)
  companyStatus?: companyStatus;

  @IsNotEmpty()
  @IsEnum(currency)
  currency: currency;

  @IsOptional()
  @IsString()
  logoUrl?: string;

}
