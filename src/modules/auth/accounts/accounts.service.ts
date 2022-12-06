import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddAccountDto } from './dto/add-accounts.dto';
import { UpdateAccountDto } from './dto/update-accounts.dto';
import { AccountsEntity } from './entity/accounts.entity';

@Injectable()
export class AccountsService {
  constructor(
  @InjectRepository(AccountsEntity)
    private accountsRepository: Repository<AccountsEntity>
  ) {}

  /**
   * Function common for search an account by id
   * @param id 
   * @returns AccountsEntity
   */
  async findAccountById(id :number): Promise<AccountsEntity> {
    const account = await this.accountsRepository.findOneBy({ id });
    // if the accountId doesn't exists
    if(!account) {
      throw new NotFoundException(`The account with id n° ${id} doesn't exists.`)
    }
    return account;
  }

  async findAccountByMatricule(matricule: string): Promise<AccountsEntity> {
    const account = await this.accountsRepository.findOne({
      where: {
        companyMatricule: matricule
      }
    });
    // if the accountId doesn't exists
    if(!account) {
      return null;
    }
    return account;
  }

  /**
   * we get all the accounts and all relations
   * if accountId === 1, we get all accounts // else we get this account
   * @returns AccountsEntity
   */
  async getAccountInfos(accountId: number, users: boolean = true): Promise<AccountsEntity[] | AccountsEntity> {
    if(accountId === 1) {
      return await this.accountsRepository.find({
        // relations: {
        //   users
        // }
      });
    } else {
      return await this.accountsRepository.find({
        where: { id: accountId },
        // relations: {
        //   users
        // }
      });
    }
  }

  /**
   * We create a new account
   * @param account 
   * @returns AccountsEntity
   */
  async addAccount(account: AddAccountDto): Promise<AccountsEntity> {
    return await this.accountsRepository.save(account);
  }

  /**
   * We update an account
   * @param id
   * @param account
   * @returns AccountsEntity
   */
  async updateAccount(id: number, account: UpdateAccountDto): Promise<AccountsEntity> {
    // we retrieve the user by id and we replace the news values for user
    const updatedAccount = await this.accountsRepository.preload({
      id,
      ...account
    });
    // if the accountId doesn't exists
    if(!updatedAccount) {
      throw new NotFoundException(`The account with id n° ${id} doesn't exists.`)
    }
    // we save the updated user
    return await this.accountsRepository.save(updatedAccount);
  }

  /**
   * We delete an account in a soft way
   * @param id 
   * @returns response typeOrm : { generatedMaps: [], rax: [], affected: number }
   */
  async softDeleteAccount(id: number) {
    return await this.accountsRepository.softDelete(id);
  }

  /**
   * We restore an account when he has been deleted in a sotf way
   * @param id 
   * @returns response typeOrm : { generatedMaps: [], rax: [], affected: number }
   */
  async restoreAccount(id: number) {
    // we restore the account (softDelete)
    return await this.accountsRepository.restore(id);
  }

  /**
   * we delete an account in a hard way
   * @param id 
   * @returns response typeOrm : { raw: [], affected: number }
   */
  async hardDeleteAccount(id: number) {
    // check if it exists
    await this.findAccountById(id);
    // we remove it
    return await this.accountsRepository.delete(id);
  }
}
