import { calcAutoScore, calcTeleopScore } from '@/lib/graphUtils';
import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Box, Title } from '@mantine/core';
import Section from '../Section';
import { TeamTables } from './TeamTables';

interface Props {
	team: TeamData;
	standForms: StandFormI[];
}

const percentOptions = { maximumFractionDigits: 2, style: 'decimal' };

const TeamStats = ({ team, standForms }: Props) => {
	return (
		<Section title='Team Stats'>
			<Title order={2}>Scores</Title>
			<Box>
				<Title order={4}>Avg Auto: {team.avgAutoScore?.toFixed(2)}</Title>
				<Title order={4}>Avg Teleop: {team.avgTeleopScore?.toFixed(2)}</Title>
			</Box>
			<TeamTables
				standForms={standForms}
				team={team}
				tableDefs={[
					{ title: 'Teleop Pieces Scored', dataFn: calcTeleopScore },
					{ title: 'Auto Pieces Scored', dataFn: calcAutoScore },
				]}
			/>
		</Section>
	);
};

export default TeamStats;
