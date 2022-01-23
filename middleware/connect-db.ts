import { Middleware } from '@/lib/api/RouteHandler';
import mongoose from 'mongoose';

export const CONNECT_DB_MIDDLEWARE_KEY = 'connectDB';

const connectDB: Middleware = {
	key: CONNECT_DB_MIDDLEWARE_KEY,
	middleware: async () => {
		const uri = process.env.DB_URI;
		if (!uri) {
			console.log('No URI, could not connect to DB.');
			return;
		}
		if (mongoose.connections[0].readyState) {
			// use the current connection
			return;
		}
		//use a new connection
		await mongoose
			.connect(uri, { dbName: process.env.DEFAULT_DB })
			.catch((err: unknown) => console.error(err));
		return;
	},
};

export default connectDB;
