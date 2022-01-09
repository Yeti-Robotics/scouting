import { TeamData } from '@/models/aggregations/teamData';
import { DataGrid } from '@mui/x-data-grid';
import { tableColumns } from './columns';

interface Props {
	data: TeamData[];
}

const TeamDataTable: React.VFC<Props> = ({ data }) => {
	return (
		<div style={{ maxWidth: '100%', width: 1420, height: 1000 }}>
			<DataGrid getRowId={(row) => row.teamNumber} columns={tableColumns} rows={data} />
		</div>
	);
};

export default TeamDataTable;
