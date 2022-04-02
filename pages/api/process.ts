import { RouteHandler } from '@/lib/api/RouteHandler';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';

const getAvg = (balls: number[]) => balls.reduce((acc, curr) => (acc += curr), 0) / balls.length;

const getStdDev = (balls: number[]) => {
	let total = 0;
	const avg = getAvg(balls);
	balls.reduce((acc, curr) => (acc += curr));
};

export default new RouteHandler().get(async (req, res) => {
	const forms = await StandForm.find({});
	const teamData: RawTeamData[] = await StandForm.aggregate(teamDataAggregation);

	const teleopUpperBallsScored = forms
		.map((form) => {
			if (form.teleopUpperBallsScored === 0 && form.teleopUpperBallsMissed === 0) {
				return;
			}
			return form.teleopUpperBallsScored;
		})
		.filter((score) => score !== undefined);

	const teleopLowerBallsScored = forms
		.map((form) => {
			if (form.teleopLowBallsScored === 0 && form.teleopLowBallsMissed === 0) {
				return;
			}
			return form.teleopLowBallsScored;
		})
		.filter((score) => score !== undefined);
});
