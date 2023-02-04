import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { Box, Collapse, Paper, Sx, Tooltip } from '@mantine/core';

interface Props {
	table: HTMLDivElement;
	match: MatchData;
	team: StandFormWithName;
	auto: boolean;
	level: 'top' | 'mid' | 'low';
	piece: 'cube' | 'cone';
	maxScored: number;
	tableHeight: number;
	showBars: boolean;
}

const getBalls = ({
	auto,
	level,
	piece,
	team,
}: Pick<Props, 'auto' | 'level' | 'piece' | 'team'>): number => {
	if (auto) {
		if (level === 'top') {
			if (piece === 'cone') {
				return team.autoTopCones;
			} else {
				return team.autoTopCubes;
			}
		} else if (level === 'mid') {
			if (piece === 'cone') {
				return team.autoMidCones;
			} else {
				return team.autoMidCubes;
			}
		} else {
			if (piece === 'cone') {
				return team.autoLowCones;
			} else {
				return team.autoLowCubes;
			}
		}
	} else {
		if (level === 'top') {
			if (piece === 'cone') {
				return team.teleopTopCones;
			} else {
				return team.teleopTopCubes;
			}
		} else if (level === 'mid') {
			if (piece === 'cone') {
				return team.teleopMidCones;
			} else {
				return team.teleopMidCubes;
			}
		} else {
			if (piece === 'cone') {
				return team.teleopLowCones;
			} else {
				return team.teleopLowCubes;
			}
		}
	}
};

const ShootingTableBar = ({
	auto,
	level,
	piece,
	team,
	maxScored,
	tableHeight,
	showBars,
}: Props) => {
	const scored = getBalls({ auto, level, piece, team });
	const barHeight = (scored / maxScored) * tableHeight - 25;

	const barStyles: Sx =
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
				<Tooltip label={scored}>
					<Paper sx={barStyles} />
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
