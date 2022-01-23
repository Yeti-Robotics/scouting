import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import connectDB from '@/middleware/connect-db';
import { auth } from '@/middleware/auth';

const handler = new RouteHandler<'api', WAuth>();

handler
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user) return res.status(403).json({ message: 'You are unauthorized.' });
		return res.status(200).json(req.user);
	});

export default handler;
