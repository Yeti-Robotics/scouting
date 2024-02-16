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
				{ blue1a: req.user._id },
				{ blue1a: req.user._id },
				{ blue2a: req.user._id },
				{ blue2b: req.user._id },
				{ blue3a: req.user._id },
				{ blue3b: req.user._id },
				{ red1a: req.user._id },
				{ red1b: req.user._id },
				{ red2a: req.user._id },
				{ red2b: req.user._id },
				{ red3a: req.user._id },
				{ red3b: req.user._id },
			])
			.populate({
				path: 'blue1a blue1b blue2a blue2b blue3a blue3b red1a red1b red2a red2b red3a red3b',
			});
		return res.status(200).json(blocks);
	});
