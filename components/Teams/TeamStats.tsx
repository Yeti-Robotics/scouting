import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Box } from '@mantine/core';
import Section from '../Section';
import { formTableColumns } from './formTableColumns';

interface Props {
	team: TeamData;
	standForms: StandFormI[];
}

const percentOptions = { maximumFractionDigits: 2, style: 'decimal' };

const TeamStats = ({ team, standForms }: Props) => {
	return (
		<Section title='Team Stats'>
			<Box>
				<h2>Total Balls</h2>
				<Box>
					<h4>Avg Auto: {team.avgAutoScore?.toFixed(2)}</h4>
					<h4>Avg Teleop: {team.avgTeleopScore?.toFixed(2)}</h4>
				</Box>
				<Box sx={{ height: 800, maxWidth: 800, width: '100%' }}>{/* Table here */}</Box>
			</Box>
		</Section>
	);
};

export default TeamStats;
