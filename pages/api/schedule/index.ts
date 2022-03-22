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

		const blocks = await ScheduleBlock.find({}).populate('blue1 blue2 blue3 red1 red2 red3');

		return res.status(200).json(blocks);
	})
	.post(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized.' });
		const block: CreateScheduleBlock = JSON.parse(req.body);

		const savedBlock = new ScheduleBlock({
			...block,
			startTime: new Date(block.startTime).valueOf(),
			endTime: new Date(block.endTime).valueOf(),
		});
		await savedBlock.save();

		return res.status(200).json({ message: 'Block successfully created.' });
	})
	.patch(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update blocks.' });
		const block: CreateScheduleBlock = JSON.parse(req.body);

		await ScheduleBlock.updateOne({ _id: block._id }, block);
		return res.status(200).json({ message: 'Block successfully updated.' });
	})
	.delete(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update blocks.' });
		const block: CreateScheduleBlock = JSON.parse(req.body);

		await ScheduleBlock.findByIdAndDelete(block._id);
		return res.status(200).json({ message: 'Block successfully deleted.' });
	});
