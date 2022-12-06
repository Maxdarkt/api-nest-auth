import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsEntity } from './accounts/entity/accounts.entity';
import { UsersEntity } from './users/entity/users.entity';
import { AccountsService } from './accounts/accounts.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsEntity, UsersEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600
      }
    }),
    UsersModule, 
    AccountsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountsService, UsersService , JwtStrategy],
  exports: [],
})
export class AuthModule {}
