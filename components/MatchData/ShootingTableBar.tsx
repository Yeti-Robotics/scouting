import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { Box, Collapse, FormControlLabel, Paper, Switch, SxProps, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
	table: HTMLDivElement;
	match: MatchData;
	team: StandFormWithName;
	auto: boolean;
	low: boolean;
	maxScored: number;
	tableHeight: number;
	showBars: boolean;
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
	showBars,
}) => {
	const stats = getBalls({ auto, low, team });
	const barHeight = (stats.scored / maxScored) * tableHeight - 25;

	const barStyles: SxProps =
		maxScored !== 0
			? {
					height: barHeight,
					backgroundColor: 'primary.main',
					transition: 'background-color 0.3s ease',
					width: '40px',
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
				alignSelf: 'flex-end',
			}}
		>
			<Collapse in={showBars}>
				<Tooltip followCursor title={stats.scored}>
					<Paper sx={barStyles} elevation={1} />
				</Tooltip>
			</Collapse>
			<Box
				sx={{
					width: '100%',
					borderTop: '1px solid',
					px: 1,
					textAlign: 'center',
					position: 'relative',
				}}
			>
				{team.teamNumber} {team.teamName}
			</Box>
		</Box>
	);
};

export default ShootingTableBar;
