import { TeamData } from '@/models/aggregations/teamData';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tableColumns } from './columns';

interface Props {
	data: TeamData[];
}

const TeamDataTable: React.VFC<Props> = ({ data }) => {
	return (
		<Box sx={{ maxWidth: '100%', width: 1430, height: 1000, margin: 2 }}>
			<DataGrid getRowId={(row) => row.teamNumber} columns={tableColumns} rows={data} />
		</Box>
	);
};

export default TeamDataTable;
