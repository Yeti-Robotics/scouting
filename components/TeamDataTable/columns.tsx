import { TeamData } from '@/models/aggregations/teamData';

const percentageFormatter = (cell: any) =>
	(Number(cell.value) / 100).toLocaleString(undefined, {
		style: 'percent',
		minimumFractionDigits: 2,
	});

const truncDecimals = (cell: any) =>
	Number(cell.value).toLocaleString(undefined, { maximumFractionDigits: 2 });

export const tableColumns: any[] = [];
