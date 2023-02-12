import { filterTeams, getTeamColor } from '@/lib/matchDataUtils';
import { MatchData } from '@/models/aggregations/matchData';
import { Table, Box, Anchor } from '@mantine/core';
import { ReactNode } from 'react';
import { Link } from '../Link';

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
	<Box component='td' sx={{ color: 'white', fontWeight: 600 }} align='center' {...props}>
		{children}
	</Box>
);

const MobileShootingTable: React.VFC<Props> = ({ match }) => {
	return (
		<Box sx={{ maxWidth: '1000px' }}>
			<Table>
				<th>
					<tr>
						{columns.map((col) => (
							<td key={col.label} align='center' style={{ minWidth: col.minWidth }}>
								{col.label}
							</td>
						))}
					</tr>
				</th>
				<tbody>
					{filterTeams(match, (team) => Boolean(team)).map((team) => {
						if (!team) return <></>;
						return (
							<Box
								component='tr'
								key={team?._id}
								sx={{
									backgroundColor: getTeamColor(match, team),
									color: 'white',
									fontWeight: 500,
								}}
							>
								<BodyCell>
									<Link href={`/teams/${team?.teamNumber}`} passHref>
										<Anchor
											sx={{ color: 'white', textDecoration: 'underline' }}
										>
											{team?.teamNumber}
										</Anchor>
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
							</Box>
						);
					})}
				</tbody>
			</Table>
		</Box>
	);
};

export default MobileShootingTable;
