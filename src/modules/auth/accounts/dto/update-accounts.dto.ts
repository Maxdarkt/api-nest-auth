import { IsEnum, IsOptional, IsString } from "class-validator";
import { companyStatus, currency } from "../enum/accounts.enum";

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  division: string;

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
  @IsString()
  companyMatricule: string;

  @IsOptional()
  @IsEnum(companyStatus)
  companyStatus: companyStatus;

  @IsOptional()
  @IsEnum(currency)
  currency: currency;

  @IsOptional()
  @IsString()
  logoUrl: string;

}
