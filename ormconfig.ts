import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import * as dotenv from 'dotenv';
dotenv.config();

export const mysqlOptions: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST_DEV,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME_DEV,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_DEV,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  synchronize: false,
  // migrations: [
  //   'dist/src/db/migrations/*.js'
  // ],
}
