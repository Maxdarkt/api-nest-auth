import { Controller, forwardRef, Get, Inject, UseGuards } from '@nestjs/common';
import { User } from 'src/generics/decorators/user.decorators';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { UsersEntity } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { AccountsService } from './accounts.service';
import { AccountsEntity } from './entity/accounts.entity';

@Controller('api/reportShift/accounts')
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
    // @Get()
    // async getAccountInfos(
    //   @User() requester: UsersEntity
    // ): Promise<AccountsEntity[] | AccountsEntity> {
  
    //   const accountId = requester.accountId;
  
    //   return await this.accountsService.getAccountInfos(accountId);
    // }

    @Get()
    async getAccountInfos(
      @User() requester: UsersEntity
    ) {
  
      console.log('get', requester)
    }
}
