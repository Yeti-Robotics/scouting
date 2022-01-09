import mongoose from 'mongoose';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const connectDB =
	(handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
		const uri = process.env.DB_URI;
		if (!uri) {
			console.log('No URI, could not connect to DB.');
			return;
		}
		if (mongoose.connections[0].readyState) {
			// use the current connection
			return handler(req, res);
		}
		//use a new connection
		await mongoose
			.connect(uri, { dbName: 'scouting' })
			.catch((err: unknown) => console.error(err));
		return handler(req, res);
	};

export default connectDB;
