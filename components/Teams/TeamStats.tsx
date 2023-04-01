import { calcAutoPieces, calcTeleopPieces } from '@/lib/graphUtils';
import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Box, Text, Title } from '@mantine/core';
import Section from '../Section';
import { TeamTables } from './TeamTables';

interface Props {
	team: TeamData;
	standForms: StandFormI[];
}

const TeamStats = ({ team, standForms }: Props) => {
	return (
		<Section title='Team Stats'>
			<Title order={2}>Scores</Title>
			<Box>
				<Text>
					<strong>Avg Auto:</strong> {team.avgAutoScore?.toFixed(2)}
				</Text>
				<Text>
					<strong>Avg Teleop:</strong> {team.avgTeleopScore?.toFixed(2)}
				</Text>
			</Box>
			<TeamTables
				standForms={standForms}
				team={team}
				tableDefs={[
					{ title: 'Teleop Pieces Scored', dataFn: calcTeleopPieces },
					{ title: 'Auto Pieces Scored', dataFn: calcAutoPieces },
				]}
			/>
		</Section>
	);
};

export default TeamStats;
