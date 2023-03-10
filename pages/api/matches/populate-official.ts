import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match, { ScoreBreakdown, TBAMatchRaw } from '@/models/Match';

const getPiecesScored = (breakdown: ScoreBreakdown) => {
	const scores = {
		lowCubes: 0,
		lowCones: 0,
		midCubes: 0,
		midCones: 0,
		highCubes: 0,
		highCones: 0,
	};

	breakdown.teleopCommunity.B.forEach((cell) => {
		if (cell === 'Cone') scores.lowCones += 1;
		if (cell === 'Cube') scores.lowCones += 1;
	});

	breakdown.teleopCommunity.M.forEach((cell) => {
		if (cell === 'Cone') scores.midCones += 1;
		if (cell === 'Cube') scores.midCones += 1;
	});

	breakdown.teleopCommunity.T.forEach((cell) => {
		if (cell === 'Cone') scores.highCones += 1;
		if (cell === 'Cube') scores.highCones += 1;
	});

	return scores;
};

// This route gets official data from tba and then adds them to our matches
export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		if (!req.user || !req.user.administrator)
			return res.status(403).json({ message: 'Must be an admin to do this.' });
		const headers = new Headers();
		headers.append('X-TBA-Auth-Key', String(process.env.TBA_SECRET));
		headers.append('accept', 'application/json');
		const apiRes = await fetch(
			`https://www.thebluealliance.com/api/v3/event/${compKey.compKey}/matches`,
			{ headers },
		);
		if (!apiRes.ok) return res.status(apiRes.status).send(apiRes.text());

		// Filter out non-qualification matches
		const matches = ((await apiRes.json()) as TBAMatchRaw[]).filter((match) =>
			match.key.includes('_qm'),
		);

		const updatePromises = matches.map((match) => {
			return Match.updateOne(
				{ matchNumber: match.match_number },
				{
					$set: {
						official: {
							blue: {
								teleopGrid: match.score_breakdown.blue.teleopCommunity,
								autoGrid: match.score_breakdown.blue.autoCommunity,
								...getPiecesScored(match.score_breakdown.red),
							},
							red: {
								teleopGrid: match.score_breakdown.red.teleopCommunity,
								autoGrid: match.score_breakdown.red.autoCommunity,
								...getPiecesScored(match.score_breakdown.red),
							},
						},
					},
				},
			);
		});

		await Promise.all(updatePromises);

		return res.status(200).send('');
	});
