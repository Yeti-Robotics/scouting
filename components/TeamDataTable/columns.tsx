import { RawTeamData } from '@/models/aggregations/teamData';
import { Anchor, Text } from '@mantine/core';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Link } from '../Link';

const percentageFormatter = (v: any) =>
	(Number(v) / 100).toLocaleString(undefined, {
		style: 'percent',
		minimumFractionDigits: 2,
	});

const truncDecimals = (v: any) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });

const helper = createColumnHelper<RawTeamData>();

export const columns = [
	helper.accessor('teamNumber', {
		header: () => <Text fw={700}>Team #</Text>,
		cell: (props) => <Link href={`/teams/${props.getValue()}`}>{props.getValue()}</Link>,
		maxSize: 1,
	}),
	helper.accessor('teamName', {
		header: () => <Text fw={700}>Name</Text>,
		cell: (props) => <Text>{props.getValue()}</Text>,
		maxSize: 3,
	}),
	helper.accessor('avgAutoScore', {
		header: () => <Text fw={700}>Avg. Auto</Text>,
		cell: (props) => <Text>{props.getValue()}</Text>,
		maxSize: 1,
	}),
];
