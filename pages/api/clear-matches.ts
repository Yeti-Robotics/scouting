import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match from '@/models/Match';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to clear matches.' });

		await Match.deleteMany({});

		return res.status(200).json({ message: 'Matches successfully cleared.' });
	});
