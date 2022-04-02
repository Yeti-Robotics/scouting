import { RouteHandler } from '@/lib/api/RouteHandler';
import { RawTeamData, teamDataAggregation } from '@/models/aggregations/teamData';
import StandForm from '@/models/StandForm';

const getAvg = (balls: number[]) => balls.reduce((acc, curr) => (acc += curr), 0) / balls.length;

const getStdDev = (balls: number[]) => {
	const avg = getAvg(balls);
	const stdDev = Math.sqrt(
		balls.reduce((acc, curr) => (acc += Math.pow(curr - avg, 2)), 0) / balls.length,
	);
	return stdDev;
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
		.filter((score) => score !== undefined) as number[];

	const teleopLowerBallsScored = forms
		.map((form) => {
			if (form.teleopLowBallsScored === 0 && form.teleopLowBallsMissed === 0) {
				return;
			}
			return form.teleopLowBallsScored;
		})
		.filter((score) => score !== undefined) as number[];

	console.log('Upper Ball Mean = ' + getAvg(teleopUpperBallsScored));
	console.log('Upper Ball Std Dev = ' + getStdDev(teleopUpperBallsScored));
	console.log('Low Ball Mean = ' + getAvg(teleopLowerBallsScored));
	console.log('Low Ball Std Dev = ' + getStdDev(teleopLowerBallsScored));
});
