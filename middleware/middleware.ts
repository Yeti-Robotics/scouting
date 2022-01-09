import { NextApiHandler } from 'next';
import connectDB from './connect-db';

export const middleware = (handler: NextApiHandler) => connectDB(handler);
