import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'apps/users/.env' });

export const UserDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/models/**/*.model{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
