import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match, { MatchI } from '@/models/Match';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized.' });
		const id = String(req.query.id);
		const match = await Match.findById(id);
		return res.status(200).json(match);
	})
	.patch(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update matches.' });
		const id = String(req.query.id);
		const match: MatchI = JSON.parse(req.body);

		await Match.updateOne({ _id: id }, match);
		return res.status(200).json({ message: 'Match successfully updated.' });
	})
	.delete(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update matches.' });
		const id = String(req.query.id);

		await Match.findByIdAndDelete(id);
		return res.status(200).json({ message: 'Match successfully deleted.' });
	});
