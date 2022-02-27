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
		const matches = await Match.find({});
		return res.status(200).json(matches);
	})
	.post(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized.' });
		const match: MatchI = JSON.parse(req.body);

		const savedMatch = new Match({
			...match,
			startTime: new Date(match.startTime).valueOf(),
			bets: [],
			bottomScorer: undefined,
			topScorer: undefined,
			open: true,
		});
		await savedMatch.save();

		return res.status(200).json({ message: 'Match successfully created.' });
	})
	.patch(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update matches.' });
		const match: MatchI = JSON.parse(req.body);

		await Match.updateOne({ _id: match._id }, match);
		return res.status(200).json({ message: 'Match successfully updated.' });
	})
	.delete(async (req, res) => {
		if (!req.user.administrator || !req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to update matches.' });
		const match: MatchI = JSON.parse(req.body);

		await Match.findByIdAndDelete(match._id);
		return res.status(200).json({ message: 'Match successfully deleted.' });
	});
