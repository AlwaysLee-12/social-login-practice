import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: +process.env.DB_PORT | 3306,
  username: process.env.USER_NAME,
  password: process.env.USER_PASSWORD,
  database: process.env.DATABASE,
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  synchronize: true,
};

export default config;
