import { RouteHandler } from '@/lib/api/RouteHandler';
import { Subdocument, WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import User from '@/models/User';
import Match, { Bet, MatchI } from '@/models/Match';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(401).json({ message: 'You are not authorized to get user bets.' });

		const userId = req.query.id;
		const userInQuestion = await User.findById(userId);
		if (!userInQuestion)
			return res.status(400).json({ message: 'No user with this id exists.' });

		const bets: (Bet & { matchNumber: number; setNumber: number })[] = [];

		const matches = await Match.find({ bets: { $exists: true, $ne: [] } }).sort('-startTime');

		matches.forEach((match) =>
			match.bets.forEach((bet: Subdocument<Bet, MatchI>) =>
				(bet as any).username === userInQuestion.username
					? bets.push({
							...bet.toJSON<Bet>(),
							matchNumber: match.matchNumber,
							setNumber: match.setNumber,
					  })
					: null,
			),
		);

		return res
			.status(200)
			.json({ username: userInQuestion.username, coins: userInQuestion.coins, bets });
	});
