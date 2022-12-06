import { AddAccountDto } from "src/modules/auth/accounts/dto/add-accounts.dto";
import { companyStatus, currency } from "src/modules/auth/accounts/enum/accounts.enum";

export const mockAccounts: AddAccountDto[] = [
  {
    name: "mt-develop",
    division: "Genève",
    complement: "C/O Calliopée Business Center",
    address: "Rue de Chantepoulet 10",
    postal: "1201",
    city: "GENEVE",
    country: "SUISSE",
    companyMatricule: null,
    companyStatus: companyStatus.EI,
    currency: currency.CHF,
    logoUrl: null,
  },
  {
    name: "TELT CO08",
    complement: "ZA du Pré de Pâques",
    address: "Rue de grand champ",
    postal: "73870",
    city: "SAINT-JULIEN-MONT-DENIS",
    country: "FRANCE",
    companyStatus: companyStatus.GPT,
    currency: currency["€"],
  }
]