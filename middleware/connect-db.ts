import { RouteHandlerMiddleware } from '@/lib/api/RouteHandler';
import mongoose from 'mongoose';
import CompKey from '../models/CompKey';

export const CONNECT_DB_MIDDLEWARE_KEY = 'connectDB';

export const connectToDbB = async () => {
	const uri = process.env.DB_URI;
	if (!uri) {
		console.log('No URI, could not connect to DB.');
		return;
	}
	if (mongoose.connections[0].readyState) {
		// use the current connection
	} else {
		//use a new connection
		await mongoose
			.connect(uri, { dbName: process.env.DEFAULT_DB })
			.catch((err: unknown) => console.error(err));
	}

	if (!global.compKey) {
		const compKey = await CompKey.findOne();
		if (!compKey) return;
		global.compKey = {
			compKey: compKey.compKey,
			compYear: parseInt(compKey.compKey.replace(/\D/g, '')),
		};
	}

	return;
};

const connectDB: RouteHandlerMiddleware<'both'> = {
	key: CONNECT_DB_MIDDLEWARE_KEY,
	ssr: true,
	middleware: connectToDbB,
};

export default connectDB;
