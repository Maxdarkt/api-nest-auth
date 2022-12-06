import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsEntity } from './entity/accounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsEntity, UsersEntity])
  ],
  controllers: [AccountsController],
  providers: [AccountsService, UsersService]
})
export class AccountsModule {}
