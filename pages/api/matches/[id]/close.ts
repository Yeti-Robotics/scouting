import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match, { MatchI } from '@/models/Match';
import StandForm, { StandFormI } from '@/models/StandForm';
import User from '@/models/User';

const calcScore = (form: StandFormI) => {
	let auto = form.autoAmpNotes * 2 + form.autoSpeakerNotes * 5;

	const teleop =
		form.teleopAmpNotes * 1 +
		form.teleopSpeakerNotes * 2 +
		form.teleopAmplifiedSpeakerNotes * 5;
	let endScore = 0;

	// add points from end charging
	if (form.climb) {
		endScore += 4 + 2 * (form.numberOnChain - 1);
	}

	return auto + teleop + endScore;
};

const avgForms = (forms: StandFormI[]) =>
	forms.reduce((acc, form) => (acc += calcScore(form)), 0) / (forms.length || 1);

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || !req.user.administrator || req.user.banned)
			return res.status(403).json({ message: 'You are not authorized to close a match.' });

		const matchId = String(req.query.id);
		const match = await Match.findById(matchId);
		if (!match) return res.status(400).json({ message: 'No match with this id.' });
		if (!match.open) return res.status(400).json({ message: 'Match already closed.' });
		match.winner = String(req.query.winner) as 'red' | 'blue' | 'tie';

		const forms = await StandForm.find({ matchNumber: match.matchNumber });
		if (!forms) return res.status(400).json({ message: 'There were no forms for this match.' });

		const scores = { blue1: 0, blue2: 0, blue3: 0, red1: 0, red2: 0, red3: 0 };
		const blue1Forms: StandFormI[] = [];
		const blue2Forms: StandFormI[] = [];
		const blue3Forms: StandFormI[] = [];
		const red1Forms: StandFormI[] = [];
		const red2Forms: StandFormI[] = [];
		const red3Forms: StandFormI[] = [];

		forms.forEach((form) => {
			if (form.teamNumber === match.blue1) {
				blue1Forms.push(form);
			} else if (form.teamNumber === match.blue2) {
				blue2Forms.push(form);
			} else if (form.teamNumber === match.blue3) {
				blue3Forms.push(form);
			} else if (form.teamNumber === match.red1) {
				red1Forms.push(form);
			} else if (form.teamNumber === match.red2) {
				red2Forms.push(form);
			} else if (form.teamNumber === match.red3) {
				red3Forms.push(form);
			}
		});

		scores.blue1 = avgForms(blue1Forms);
		scores.blue2 = avgForms(blue2Forms);
		scores.blue3 = avgForms(blue3Forms);
		scores.red1 = avgForms(red1Forms);
		scores.red2 = avgForms(red2Forms);
		scores.red3 = avgForms(red3Forms);

		const mappedArr: { team: keyof MatchI; score: number }[] = [
			{ team: 'blue1', score: scores.blue1 },
			{ team: 'blue2', score: scores.blue2 },
			{ team: 'blue3', score: scores.blue3 },
			{ team: 'red1', score: scores.red1 },
			{ team: 'red2', score: scores.red2 },
			{ team: 'red3', score: scores.red3 },
		];

		const bottomScorer = mappedArr.sort((a, b) => a.score - b.score)[0].team;
		const topScorer = mappedArr.sort((a, b) => b.score - a.score)[0].team;

		const bottomScorerTie =
			mappedArr.filter(
				(score) => score.score === mappedArr.sort((a, b) => a.score - b.score)[0].score,
			).length > 1;

		const topScorerTie =
			mappedArr.filter(
				(score) => score.score === mappedArr.sort((a, b) => b.score - a.score)[0].score,
			).length > 1;

		// paying out bets
		const saves = await match.bets.map(async (bet) => {
			const better = await User.findOne({ username: bet.username });
			if (!better) return Promise.resolve();
			if (bet.bottomScorer) {
				console.log('bottom');
				if (bet.bottomScorer.bet === match[bottomScorer] && !bottomScorerTie) {
					better.coins = better.coins + bet.bottomScorer.amount * 2;
					bet.bottomScorer.won = true;
				} else {
					bet.bottomScorer.won = false;
				}
			}
			if (bet.topScorer) {
				console.log('top');
				if (bet.topScorer.bet === match[topScorer] && !topScorerTie) {
					better.coins = better.coins + bet.topScorer.amount * 2;
					bet.topScorer.won = true;
				} else {
					bet.topScorer.won = false;
				}
			}
			if (bet.winner) {
				console.log('win');
				// I had to do it ts is wrong :pensive:
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				if (bet.winner.bet === match.winner && match.winner !== 'tie') {
					better.coins = better.coins + bet.winner.amount * 1.5;
					bet.winner.won = true;
				} else {
					bet.winner.won = false;
				}
			}

			bet.paid = true;
			better.validateSync();
			return better.save();
		});

		await Promise.all(saves);
		match.open = false;
		await match.save();
		return res.status(200).json({ message: 'Bets paid out for this match.' });
	});
