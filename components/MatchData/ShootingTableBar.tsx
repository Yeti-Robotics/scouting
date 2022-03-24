import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { Box, SxProps, Tooltip } from '@mui/material';

interface Props {
	table: HTMLDivElement;
	match: MatchData;
	team: StandFormWithName;
	auto: boolean;
	low: boolean;
	maxScored: number;
	tableHeight: number;
}

const getBalls = ({ auto, low, team }: Pick<Props, 'auto' | 'low' | 'team'>) => {
	if (auto && low) return { scored: team.autoLowBallsScored, missed: team.autoLowBallsMissed };
	if (auto && !low)
		return { scored: team.autoUpperBallsScored, missed: team.autoUpperBallsMissed };
	if (!auto && low)
		return { scored: team.teleopLowBallsScored, missed: team.teleopUpperBallsMissed };
	return { scored: team.teleopUpperBallsScored, missed: team.teleopUpperBallsMissed };
};

const ShootingTableBar: React.VFC<Props> = ({
	match,
	table,
	auto,
	low,
	team,
	maxScored,
	tableHeight,
}) => {
	const stats = getBalls({ auto, low, team });

	const barHeight = (stats.scored / maxScored) * 100;
	const fillerHeight = 100 - barHeight;

	const barStyles: SxProps =
		maxScored !== 0
			? {
					height: `${(stats.scored / maxScored) * 100}%`,
					backgroundColor: 'primary.main',
					width: '90%',
					transition: 'height 0.3s ease, background-color 0.3s ease',
					'&:hover': {
						backgroundColor: 'primary.light',
					},
			  }
			: {
					display: 'none',
			  };

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				flexGrow: 1,
			}}
		>
			<div style={{ height: `${fillerHeight}%` }}></div>
			<Tooltip followCursor title={stats.scored}>
				<Box sx={barStyles}></Box>
			</Tooltip>
			<Box sx={{ width: '100%', borderTop: '1px solid', px: 1, textAlign: 'center' }}>
				{team.teamNumber} {team.teamName}
			</Box>
		</Box>
	);
};

export default ShootingTableBar;
