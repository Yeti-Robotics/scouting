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
	helper.group({
		id: 'cones',
		header: () => (
			<Text fw={700} align='center'>
				Avg Cones
			</Text>
		),
		maxSize: 460,
		columns: [
			helper.accessor('avgTopCones', {
				header: () => <Text fw={700}>Top</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
			helper.accessor('avgMidCones', {
				header: () => <Text fw={700}>Mid</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
			helper.accessor('avgLowCones', {
				header: () => <Text fw={700}>Low</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
		],
	}),
	helper.group({
		id: 'cubes',
		header: () => (
			<Text fw={700} align='center'>
				Avg Cubes
			</Text>
		),
		maxSize: 460,
		columns: [
			helper.accessor('avgTopCubes', {
				header: () => <Text fw={700}>Top</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
			helper.accessor('avgMidCubes', {
				header: () => <Text fw={700}>Mid</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
			helper.accessor('avgLowCubes', {
				header: () => <Text fw={700}>Low</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
		],
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
						href={`/teams/compare?team1=${row.original.teamNumber}`}
						icon={<IconArrowsDiff size={16} />}
					>
						Compare
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		),
	}),
];
