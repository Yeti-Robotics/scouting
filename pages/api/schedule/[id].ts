import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import ScheduleBlock, { CreateScheduleBlock } from '@/models/ScheduleBlock';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(403).json({ message: 'You are not authorized.' });

		const block = await ScheduleBlock.findById(String(req.query.id)).populate(
			'blue1 blue2 blue3 red1 red2 red3',
		);

		return res.status(200).json(block);
	})
	.patch(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update blocks.' });
		const block: CreateScheduleBlock = JSON.parse(req.body);

		await ScheduleBlock.updateOne({ _id: String(req.query.id) }, block);
		return res.status(200).json({ message: 'Block successfully updated.' });
	})
	.delete(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update blocks.' });

		await ScheduleBlock.findByIdAndDelete(String(req.query.id));
		return res.status(200).json({ message: 'Block successfully deleted.' });
	});
