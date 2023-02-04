import { GridColumns, GridValueFormatterParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';
import { TeamData } from '@/models/aggregations/teamData';

const percentageFormatter = (cell: GridValueFormatterParams) =>
	(Number(cell.value) / 100).toLocaleString(undefined, {
		style: 'percent',
		minimumFractionDigits: 2,
	});

const truncDecimals = (cell: GridValueFormatterParams) =>
	Number(cell.value).toLocaleString(undefined, { maximumFractionDigits: 2 });

export const tableColumns: GridColumns<TeamData> = [
	{
		field: 'teamNumber',
		headerName: 'Team #',
		renderCell: (params) => {
			if (!params.value) return <MuiLink>None</MuiLink>;
			return (
				<Link href={`/teams/${params.value}`} passHref={true}>
					<MuiLink>{params.value}</MuiLink>
				</Link>
			);
		},
	},
	{
		field: 'teamName',
		headerName: 'Team Name',
		width: 105,
	},
	{
		field: 'avgAutoScore',
		headerName: 'Avg Auto Score',
		width: 130,
		valueFormatter: truncDecimals,
	},
	{
		field: 'avgTeleopScore',
		headerName: 'Avg Teleop Score',
		width: 140,
		valueFormatter: truncDecimals,
	},
	{
		field: 'avgEndScore',
		headerName: 'Avg End Score',
		width: 130,
		valueFormatter: truncDecimals,
	},
	{
		field: 'initiationLine',
		headerName: 'Init Line %',
		width: 130,
		valueFormatter: percentageFormatter,
	},
	{
		field: 'avgPenalties',
		headerName: 'Avg Penalties',
		width: 115,
		valueFormatter: truncDecimals,
	},
	{
		field: 'avgDefense',
		headerName: 'Avg Defense',
		width: 110,
		valueFormatter: truncDecimals,
	},
];
