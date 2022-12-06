import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlOptions } from 'ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      ...mysqlOptions
    }),
    AuthModule, 
    ReportModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
