import { endPosToString } from '@/lib/mode';
import { GridColumns, GridValueFormatterParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';

const percentageFormatter = (cell: GridValueFormatterParams) =>
	(Number(cell.value) / 100).toLocaleString(undefined, {
		style: 'percent',
		minimumFractionDigits: 2,
	});

const truncDecimals = (cell: GridValueFormatterParams) =>
	Number(cell.value).toLocaleString(undefined, { maximumFractionDigits: 2 });

export const tableColumns: GridColumns = [
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
		field: 'avgUpperBallsScored',
		headerName: 'Avg Upper Scored',
		width: 130,
		valueFormatter: truncDecimals,
	},
	{
		field: 'avgLowBallsScored',
		headerName: 'Avg Low Scored',
		width: 140,
		valueFormatter: truncDecimals,
	},
	{
		field: 'avgUpperAuto',
		headerName: 'Upper Auto Acc',
		width: 130,
		valueFormatter: percentageFormatter,
	},
	{
		field: 'avgLowerAuto',
		headerName: 'Lower Auto Acc',
		width: 130,
		valueFormatter: percentageFormatter,
	},
	{
		field: 'avgUpperTeleop',
		headerName: 'Upper Teleop Acc',
		width: 135,
		valueFormatter: percentageFormatter,
	},
	{
		field: 'avgLowerTeleop',
		headerName: 'Lower Teleop Acc',
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
	{
		field: 'bestEndPosition',
		headerName: 'Best End Position',
		width: 180,
	},
];
