import { GridColumns } from '@mui/x-data-grid';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { green, red } from '@mui/material/colors';
import { StandFormI } from '@/models/StandForm';

export const formTableColumns: GridColumns<StandFormI> = [
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
		field: 'autoTopCones',
		headerName: 'Top Cones Auto',
	},
	{
		field: 'autoTopCubes',
		headerName: 'Top Cubes Auto',
	},
	{
		field: 'autoMidCones',
		headerName: 'Mid Cones Auto',
	},
	{
		field: 'autoMidCubes',
		headerName: 'Mid Cubes Auto',
	},
	{
		field: 'autoLowCones',
		headerName: 'Low Cones Auto',
	},
	{
		field: 'autoLowCubes',
		headerName: 'Low Cubes Auto',
	},
	{
		field: 'teleopTopCones',
		headerName: 'Top Cones Teleop',
	},
	{
		field: 'teleopTopCubes',
		headerName: 'Top Cubes Teleop',
	},
	{
		field: 'teleopMidCones',
		headerName: 'Mid Cones Teleop',
	},
	{
		field: 'teleopMidCubes',
		headerName: 'Mid Cubes Teleop',
	},
	{
		field: 'teleopLowCones',
		headerName: 'Low Cones Teleop',
	},
	{
		field: 'teleopLowCubes',
		headerName: 'Low Cubes Teleop',
	},
	{
		field: 'initiationLine',
		headerName: 'Taxi',
		renderCell: (params) => {
			if (params.value) {
				return <Check sx={{ color: green[500] }} />;
			} else {
				return <Close sx={{ color: red[500] }} />;
			}
		},
	},
	{
		field: 'preload',
		headerName: 'Preload',
		renderCell: (params) => {
			if (params.value) {
				return <Check sx={{ color: green[500] }} />;
			} else {
				return <Close sx={{ color: red[500] }} />;
			}
		},
	},
];
