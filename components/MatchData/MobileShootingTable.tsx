import { filterTeams, getTeamColor } from '@/lib/matchDataUtils';
import { MatchData } from '@/models/aggregations/matchData';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Link as MuiLink,
	Box,
} from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Column {
	label: string;
	minWidth?: number;
	align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
	format?: (value: number) => string;
}

const columns: readonly Column[] = [
	{ label: 'Team #' },
	{ label: 'Top Cones Teleop' },
	{ label: 'Top Cubes Teleop' },
	{ label: 'Mid Cones Teleop' },
	{ label: 'Mid Cubes Teleop' },
	{ label: 'Low Cones Teleop' },
	{ label: 'Low Cubes Teleop' },
	{ label: 'Top Cones Auto' },
	{ label: 'Top Cubes Auto' },
	{ label: 'Mid Cones Auto' },
	{ label: 'Mid Cubes Auto' },
	{ label: 'Low Cones Auto' },
	{ label: 'Low Cubes Auto' },
];

interface Props {
	match: MatchData;
}

const BodyCell = ({ children, ...props }: { children: ReactNode }) => (
	<TableCell sx={{ color: 'white', fontWeight: 600 }} align='center' {...props}>
		{children}
	</TableCell>
);

const MobileShootingTable: React.VFC<Props> = ({ match }) => {
	return (
		<Box sx={{ maxWidth: '1000px' }}>
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((col) => (
							<TableCell
								key={col.label}
								align='center'
								style={{ minWidth: col.minWidth }}
							>
								{col.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{filterTeams(match, (team) => Boolean(team)).map((team) => {
						if (!team) return <></>;
						return (
							<TableRow
								key={team?._id}
								sx={{
									backgroundColor: getTeamColor(match, team),
									color: 'white',
									fontWeight: 500,
								}}
							>
								<BodyCell>
									<Link href={`/teams/${team?.teamNumber}`} passHref>
										<MuiLink
											sx={{ color: 'white', textDecoration: 'underline' }}
										>
											{team?.teamNumber}
										</MuiLink>
									</Link>
								</BodyCell>
								<BodyCell>{team?.teleopTopCones}</BodyCell>
								<BodyCell>{team?.teleopTopCubes}</BodyCell>
								<BodyCell>{team?.teleopMidCones}</BodyCell>
								<BodyCell>{team?.teleopMidCubes}</BodyCell>
								<BodyCell>{team?.teleopLowCones}</BodyCell>
								<BodyCell>{team?.teleopLowCubes}</BodyCell>
								<BodyCell>{team?.autoTopCones}</BodyCell>
								<BodyCell>{team?.autoTopCubes}</BodyCell>
								<BodyCell>{team?.autoMidCones}</BodyCell>
								<BodyCell>{team?.autoMidCubes}</BodyCell>
								<BodyCell>{team?.autoLowCones}</BodyCell>
								<BodyCell>{team?.autoLowCubes}</BodyCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Box>
	);
};

export default MobileShootingTable;
