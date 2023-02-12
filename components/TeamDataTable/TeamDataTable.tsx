import { TeamData } from '@/models/aggregations/teamData';
import { Box } from '@mantine/core';
import { tableColumns } from './columns';

interface Props {
	data: TeamData[];
}

const TeamDataTable: React.VFC<Props> = ({ data }) => {
	return (
		<Box sx={{ maxWidth: '100%', width: 1430, height: 1000, margin: 2 }}>
			{/* Table here */}
		</Box>
	);
};

export default TeamDataTable;
