import { Body, Controller, Delete, forwardRef, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/generics/decorators/user.decorators';
import { strNoAccent } from 'src/helpers/string.helpers';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { UsersEntity } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { AccountsService } from './accounts.service';
import { AddAccountDto } from './dto/add-accounts.dto';
import { UpdateAccountDto } from './dto/update-accounts.dto';
import { AccountsEntity } from './entity/accounts.entity';

@Controller('api/accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(
  @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private accountsService: AccountsService) {}

   /**
   * we get account and relations
   * if accoutnId === 1, we get all accounts otherise we get this account and relations
   * @return AccountsEntity[]
   */
    @Get()
    async getAccountInfos(
      @User() requester: UsersEntity
    ): Promise<AccountsEntity[] | AccountsEntity> {
  
      const accountId = requester.accountId;
  
      return await this.accountsService.getAccountInfos(accountId);
    }

    @Get('/:accountId')
    async getOneAccount(
      @Param('accountId', ParseIntPipe) accountId: number,
      @User() requester: UsersEntity
    ) {
      if(requester.accountId !== 1 && requester.accountId !== accountId) {
        throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          error: `You can't acces to an other account.`,
        }, HttpStatus.UNAUTHORIZED);
      }
      // we send the account
      return await this.accountsService.findAccountById(accountId)
    }

    /**
   * We create an account
   * @param account 
   * @returns AccountsEntity
   */
  @Post()
  async addAccount(
    @User() requester: UsersEntity,
    @Body() accountData: AddAccountDto ): Promise<AccountsEntity> {
      if(requester.accountId !== 1) {
        throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          error: 'Only mt-develop can create a new account.',
        }, HttpStatus.UNAUTHORIZED);
      }
    // we check in DB if the matricule already exists
    const existingAccount = await this.accountsService.findAccountByMatricule(accountData.companyMatricule);
    // if an account already exists with the same matricule, we check the division
    if(existingAccount && (existingAccount.companyMatricule === accountData.companyMatricule) && (existingAccount.division === accountData.division)) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'An account with the siret number and the division already exists in the database. Please contact the administrator of this account.',
      }, HttpStatus.UNAUTHORIZED);
    }
    // we replace the strings with capital letters and without accents
    const account: AddAccountDto = {
      ...accountData
    }
     // we replace the strings with capital letters and without accents 
     for(const item in accountData) {
      // we check that the data is a string not null
      if(account[item] !== null && typeof account[item] === 'string') {
        account[item] = strNoAccent(accountData[item].toUpperCase());
      }
    }
    // we send to the service
    return await this.accountsService.addAccount(account);
  }

  /**
   * We update an account
   * @param id
   * @param accountData 
   * @returns AccountsEntity
   */
  @Patch('/:id')
  async updateAccount(
    @Body() accountData: UpdateAccountDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<AccountsEntity> {
    // we create an object account
    const account: UpdateAccountDto = {
      ...accountData,
    }
    // we replace the strings with capital letters and without accents 
    for(const item in accountData) {
      // we check that the data is a string not null
      if(account[item] !== null && typeof account[item] === 'string') {
        account[item] = strNoAccent(accountData[item].toUpperCase());
      }
    }
    // we send to service for save
    return await this.accountsService.updateAccount(id, account);
  }

  /**
   * We delete an account in a soft way
   * @param id 
   * @returns response typeOrm : { generatedMaps: [], raw: [], affected: number }
   */
  @Delete('/soft/:id')
  async softDeleteAccount(@Param('id', ParseIntPipe) id: number) {
    return await this.accountsService.softDeleteAccount(id);
  }

  /**
   * we restore an account when he has been deleted in a soft way
   * @param id 
   * @returns response typeOrm : { generatedMaps: [], raw: [], affected: number }
   */
   @Get('/restore/:id')
   async restoreAccount(@Param('id', ParseIntPipe) id: number) {
     return await this.accountsService.restoreAccount(id);
   }

  /**
   * we delete an account in a hard way
   * @param id 
   * @returns response typeOrm : { raw: [], affected: number }
   */
  @Delete('/:id')
  async hardRemoveAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.hardDeleteAccount(id);
  }
}
