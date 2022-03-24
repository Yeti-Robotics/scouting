import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';

interface Props {
	match: MatchData;
	team: StandFormWithName;
	auto: boolean;
	low: boolean;
}

const getBalls = ({ auto, low, team }: Omit<Props, 'match'>) => {
	if (auto && low) return { scored: team.autoLowBallsScored, missed: team.autoLowBallsMissed };
	if (auto && !low)
		return { scored: team.autoUpperBallsScored, missed: team.autoUpperBallsMissed };
	if (!auto && low)
		return { scored: team.teleopLowBallsScored, missed: team.teleopUpperBallsMissed };
	return { scored: team.teleopUpperBallsScored, missed: team.teleopUpperBallsMissed };
};

const ShootingTableBar: React.VFC<Props> = ({ match, auto, low, team }) => {
	const stats = getBalls({ auto, low, team });

	return <div></div>;
};

export default ShootingTableBar;
