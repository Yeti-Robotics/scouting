import { RawTeamData } from '@/models/aggregations/teamData';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { IconArrowsDiff, IconDots } from '@tabler/icons-react';
import { createColumnHelper } from '@tanstack/react-table';
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
		// in px
		maxSize: 112,
	}),
	helper.accessor('teamName', {
		header: () => <Text fw={700}>Name</Text>,
		cell: (props) => <Text>{props.getValue()}</Text>,
		maxSize: 288,
	}),
	helper.accessor('avgAutoScore', {
		header: () => <Text fw={700}>Avg. Auto</Text>,
		cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
		maxSize: 160,
	}),
	helper.accessor('avgTeleopScore', {
		header: () => <Text fw={700}>Avg. Teleop</Text>,
		cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
		maxSize: 160,
	}),
	helper.accessor('avgEndScore', {
		header: () => <Text fw={700}>Avg. End</Text>,
		cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
		maxSize: 160,
	}),
	helper.display({
		id: 'more',
		cell: ({ row }) => (
			<Menu withinPortal>
				<Menu.Target>
					<ActionIcon variant='subtle'>
						<IconDots />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						component={Link}
						href={`/teams/compare?team=${row.original.teamNumber}`}
						icon={<IconArrowsDiff size={16} />}
					>
						Compare
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		),
	}),
];
