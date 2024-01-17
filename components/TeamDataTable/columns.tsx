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
		id: 'ampNotes',
		header: () => (
			<Text fw={700} align='center'>
				Avg Amp Notes
			</Text>
		),
		maxSize: 460,
		columns: [
			helper.accessor('avgAutoAmpNotes', {
				header: () => <Text fw={700}>Auto</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
			helper.accessor('avgTeleopAmpNotes', {
				header: () => <Text fw={700}>Teleop</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
		],
	}),
	helper.group({
		id: 'speakerNotes',
		header: () => (
			<Text fw={700} align='center'>
				Avg Speaker Notes
			</Text>
		),
		maxSize: 460,
		columns: [
			helper.accessor('avgAutoSpeakerNotes', {
				header: () => <Text fw={700}>Auto</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
			helper.accessor('avgTeleopSpeakerNotes', {
				header: () => <Text fw={700}>Teleop</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
			helper.accessor('avgTeleopAmplifiedSpeakerNotes', {
				header: () => <Text fw={700}>Teleop Amped</Text>,
				cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
			}),
		],
	}),
	helper.accessor('avgNotesMissed', {
		header: () => <Text fw={700}>Avg. Notes Missed</Text>,
		cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
		maxSize: 160,
	}),
	helper.accessor('epa', {
		header: () => <Text fw={700}>EPA</Text>,
		cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
		maxSize: 160,
	}),
	helper.accessor('avgPenalties', {
		header: () => <Text fw={700}>Avg. Penalties</Text>,
		cell: (props) => <Text>{truncDecimals(props.getValue())}</Text>,
		maxSize: 160,
	}),
	helper.accessor('avgDefense', {
		header: () => <Text fw={700}>Defense</Text>,
		cell: (props) => <Text>{truncDecimals(props.getValue() ?? 0) || 'none'}</Text>,
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
