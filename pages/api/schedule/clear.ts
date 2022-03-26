import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import ScheduleBlock from '@/models/ScheduleBlock';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || !req.user.administrator || req.user.banned)
			return res.status(403).json({ message: 'You are not authorized.' });

		await ScheduleBlock.deleteMany({});

		return res.status(200).json({ message: 'Schedule successfully cleared.' });
	});
