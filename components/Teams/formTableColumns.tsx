import { GridColumns, GridValueFormatterParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { endPosToString } from '@/lib/mode';

export const formTableColumns: GridColumns = [
	{
		field: 'matchNumber',
		headerName: 'Match',
		renderCell: (params) => {
			if (!params.value) return <MuiLink>None</MuiLink>;
			return (
				<Link href={`/matches/${params.value}`} passHref={true}>
					<MuiLink target='_blank' rel='noopener noreferrer'>
						{params.value}
					</MuiLink>
				</Link>
			);
		},
	},
	{
		field: 'teleopUpperBallsScored',
		headerName: 'Teleop Upper',
	},
	{
		field: 'teleopLowBallsScored',
		headerName: 'Teleop Low',
	},
	{
		field: 'autoUpperBallsScored',
		headerName: 'Auto Upper',
	},
	{
		field: 'autoLowBallsScored',
		headerName: 'Auto Low',
	},
	{
		field: 'endPosition',
		headerName: 'End Pos',
		valueFormatter: (cell) => endPosToString(Number(cell.value)),
	},
	{
		field: 'initiationLine',
		headerName: 'Taxi',
		renderCell: (params) => {
			if (params.value) {
				return <Check />;
			} else {
				return <Close />;
			}
		},
	},
	{
		field: 'preload',
		headerName: 'Preload',
		renderCell: (params) => {
			if (params.value) {
				return <Check />;
			} else {
				return <Close />;
			}
		},
	},
];
