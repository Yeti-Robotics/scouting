import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match, { Bet } from '@/models/Match';
import User from '@/models/User';

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.post(async (req, res) => {
		if (!req.user || req.user.banned)
			return res.status(403).json({ message: 'You are not authorized to bet.' });
		const matchId = String(req.query.id);
		const match = await Match.findById(matchId);
		if (!match) return res.status(400).json({ message: 'No match with this id.' });

		// if (match.startTime < Date.now() + 300000)
		// 	return res.status(400).json({ message: 'Bets have closed for this match.' });

		if (match.bets.map((bet) => bet.username).includes(req.user.username))
			return res.status(400).json({ message: 'This user has already bet on this match.' });

		const bet: Bet = JSON.parse(req.body);

		// if a section is incomplete it will not count
		if (!bet.winner?.bet || !bet.winner?.amount) bet.winner = undefined;
		if (!bet.topScorer?.bet || !bet.topScorer?.amount) bet.topScorer = undefined;
		if (!bet.bottomScorer?.bet || !bet.bottomScorer?.amount) bet.bottomScorer = undefined;

		const bettingUser = await User.findOne({ username: req.user.username });
		if (!bettingUser) return res.status(400).json({ message: 'No user matches this token.' });

		// subtracting bets from their current coinage
		bettingUser.coins =
			bettingUser.coins -
			((bet.winner?.amount || 0) +
				(bet.topScorer?.amount || 0) +
				(bet.bottomScorer?.amount || 0));

		if (bettingUser.coins < 0)
			return res.status(400).json({ message: 'You cannot afford this bet.' });

		// validate at same time so that we only update them if both valid
		match.bets.push({ ...bet, username: req.user.username });
		await match.validate();
		await bettingUser.validate();

		await match.save();
		await bettingUser.save();

		return res.status(200).json({ message: 'Bet successfully placed.' });
	});
