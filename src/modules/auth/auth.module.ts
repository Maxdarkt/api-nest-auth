import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, AccountsModule],
  exports: [],
})
export class AuthModule {}
