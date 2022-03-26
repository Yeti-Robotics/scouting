import { config } from 'dotenv';
config({ path: process.env.NODE_ENV === 'prod' ? './.env.local' : './.env' });
