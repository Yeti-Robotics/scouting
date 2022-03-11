import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match, { MatchI, MatchSchedule } from '@/models/Match';
import User from '@/models/User';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(403).json({ message: 'You are not authorized.' });

		const schedule = Boolean(req.query.schedule);
		const matches = await Match.find({}).sort('matchNumber');

		if (schedule) {
			const users = await User.find({});
			const updatedMatches: MatchSchedule[] = matches.map((matchDoc) => {
				const match = matchDoc.toObject() as MatchSchedule;
				match.scouters = match.scouters || {}; // ensure this is defined
				match.scouters.blue1 = users.find(
					(user) => user.username === matchDoc.scouters?.blue1,
				);
				match.scouters.blue2 = users.find(
					(user) => user.username === matchDoc.scouters?.blue2,
				);
				match.scouters.blue3 = users.find(
					(user) => user.username === matchDoc.scouters?.blue3,
				);
				match.scouters.red1 = users.find(
					(user) => user.username === matchDoc.scouters?.red1,
				);
				match.scouters.red2 = users.find(
					(user) => user.username === matchDoc.scouters?.red2,
				);
				match.scouters.red3 = users.find(
					(user) => user.username === matchDoc.scouters?.red3,
				);
				return match;
			});
			return res.status(200).json(updatedMatches);
		}

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
