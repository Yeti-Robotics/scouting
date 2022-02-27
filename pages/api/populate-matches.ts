import { RouteHandler } from '@/lib/api/RouteHandler';
import { WAuth } from '@/lib/api/types';
import { auth } from '@/middleware/auth';
import connectDB from '@/middleware/connect-db';
import Match from '@/models/Match';

interface TBAMatchAlliance {
	score: number;
	team_keys: string[];
}

interface TBAMatchSimple {
	alliances: {
		blue: TBAMatchAlliance;
		red: TBAMatchAlliance;
	};
	match_number: number;
	set_number: number;
	time: number;
	predicted_time: number;
}

export default new RouteHandler<'api', WAuth>()
	.use(connectDB)
	.use(auth)
	.get(async (req, res) => {
		const eventKey = String(req.query.evKey);
		const headers = new Headers();
		headers.append('X-TBA-Auth-Key', String(process.env.TBA_SECRET));
		headers.append('accept', 'application/json');
		const apiRes = await fetch(
			`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`,
			{ headers },
		);
		if (!apiRes.ok)
			return res.status(500).json({
				message: `TBA request failed with response ${
					apiRes.status
				} and body ${JSON.stringify(await apiRes.json())}`,
			});
		const matches: TBAMatchSimple[] = await apiRes.json();

		await Match.deleteMany({});
		await matches.forEach(async (match) => {
			const savedMatch = new Match();

			// take keys and map them to team 1, 2, 3
			// key looks like frc<teamNumber> so need to use regEx to replace the
			match.alliances.blue.team_keys.map((teamKey, i) => {
				const teamNumber = parseInt(teamKey.replace(/\D/g, ''));
				switch (i) {
					case 0:
						savedMatch.blue1 = teamNumber;
						break;
					case 1:
						savedMatch.blue2 = teamNumber;
						break;
					case 2:
						savedMatch.blue3 = teamNumber;
						break;
					default:
						break;
				}
			});

			match.alliances.red.team_keys.map((teamKey, i) => {
				const teamNumber = parseInt(teamKey.replace(/\D/g, ''));
				switch (i) {
					case 0:
						savedMatch.red1 = teamNumber;
						break;
					case 1:
						savedMatch.red2 = teamNumber;
						break;
					case 2:
						savedMatch.red3 = teamNumber;
						break;
					default:
						break;
				}
			});
			savedMatch.startTime = match.predicted_time;
			savedMatch.matchNumber = match.match_number;
			savedMatch.setNumber = match.set_number;
			savedMatch.open = true;
			await savedMatch.save();
		});

		return res.status(200).json({ message: 'Matches successfully populated.' });
	});
