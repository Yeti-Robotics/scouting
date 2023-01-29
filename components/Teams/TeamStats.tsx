import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Section from '../Section';
import { formTableColumns } from './formTableColumns';

interface Props {
	team: TeamData;
	standForms: StandFormI[];
}

const DataSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;

	h2 {
		margin: 0;
		text-decoration: underline;
	}
`;

const DataWrapper = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	width: 100%;

	h4 {
		margin: 1rem;
	}
`;

const percentOptions = { maximumFractionDigits: 2, style: 'decimal' };

const TeamStats = ({ team, standForms }: Props) => {
	return (
		<Section title='Team Stats'>
			<DataSection>
				<h2>Total Balls</h2>
				<DataWrapper>
					<h4>Avg Auto: {team.avgAutoScore?.toFixed(2)}</h4>
					<h4>Avg Teleop: {team.avgTeleopScore?.toFixed(2)}</h4>
				</DataWrapper>
				<Box sx={{ height: 800, maxWidth: 800, width: '100%' }}>
					<DataGrid
						getRowId={(row) => row.matchNumber}
						rows={standForms}
						columns={formTableColumns}
					/>
				</Box>
			</DataSection>
		</Section>
	);
};

export default TeamStats;
