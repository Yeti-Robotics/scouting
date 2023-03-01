import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import ScheduleBlock from '@/models/ScheduleBlock';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user) return res.status(200).json(null);
		const blocks = await ScheduleBlock.find()
			.or([
				{ blue1: req.user._id },
				{ blue2: req.user._id },
				{ blue3: req.user._id },
				{ red1: req.user._id },
				{ red2: req.user._id },
				{ red3: req.user._id },
			])
			.populate({ path: 'blue1 blue2 blue3 red1 red2 red3' });
		return res.status(200).json(blocks);
	});
