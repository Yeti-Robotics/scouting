import { UserI } from '@/models/User';
import { Text } from '@mantine/core';
import { createColumnHelper } from '@tanstack/react-table';

const percentageFormatter = (v: any) =>
	(Number(v) / 100).toLocaleString(undefined, {
		style: 'percent',
		minimumFractionDigits: 2,
	});

const truncDecimals = (v: any) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });

const helper = createColumnHelper<UserI>();

export const columns = [
	helper.accessor('firstName', {
		header: () => <Text fw={700}>First</Text>,
		cell: (props) => <Text>{props.getValue()}</Text>,
		// in px
		maxSize: 112,
	}),
	helper.accessor('lastName', {
		header: () => <Text fw={700}>Last</Text>,
		cell: (props) => <Text>{props.getValue()}</Text>,
		// in px
		maxSize: 112,
	}),
	helper.accessor('teamNumber', {
		header: () => <Text fw={700}>SPR</Text>,
		cell: (props) => <Text>{props.getValue()}</Text>,
		maxSize: 288,
	}),
];
