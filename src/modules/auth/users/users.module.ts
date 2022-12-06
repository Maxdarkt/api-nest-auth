import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsEntity } from '../accounts/entity/accounts.entity';
import { UsersEntity } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, AccountsEntity])
  ],
  controllers: [UsersController],
  providers: [UsersService, AccountsService],
})
export class UsersModule {}
