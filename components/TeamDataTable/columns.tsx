'use client';

import { RawTeamData } from '@/models/aggregations/teamData';
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
		header: () => <div className='font-bold'>Team #</div>,
		cell: (props) => <Link href={`/teams/${props.getValue()}`}>{props.getValue()}</Link>,
		// in px
		maxSize: 112,
		meta: {
			align: 'left',
		},
	}),
	helper.accessor('teamName', {
		header: () => <div className='font-bold'>Name</div>,
		cell: (props) => <>{props.getValue()}</>,
		maxSize: 288,
		meta: {
			align: 'left',
		},
	}),
	helper.group({
		id: 'ampNotes',
		header: () => (
			<div className=' flex h-full w-full items-center justify-center text-center font-bold'>
				Avg Amp Notes
			</div>
		),
		maxSize: 460,
		columns: [
			helper.accessor('avgAutoAmpNotes', {
				header: () => <div className='font-bold'>Auto</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('avgTeleopAmpNotes', {
				header: () => <div className='font-bold'>Teleop</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				meta: {
					align: 'right',
				},
			}),
		],
	}),
	helper.group({
		id: 'speakerNotes',
		header: () => (
			<div className='  flex h-full w-full items-center justify-center text-center font-bold'>
				Avg Speaker Notes
			</div>
		),
		maxSize: 460,
		columns: [
			helper.accessor('avgAutoSpeakerNotes', {
				header: () => <div className='font-bold'>Auto</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('avgTeleopSpeakerNotes', {
				header: () => <div className='font-bold'>Teleop</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				meta: {
					align: 'right',
				},
			}),
		],
	}),
	helper.accessor('avgNotesMissed', {
		header: () => <div className='font-bold'>Avg. Notes Missed</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
		meta: {
			align: 'right',
		},
		maxSize: 160,
	}),
	helper.accessor('epa', {
		header: () => <div className='font-bold'>EPA</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
		maxSize: 160,
		meta: {
			align: 'right',
		},
	}),
	helper.accessor('avgPenalties', {
		header: () => <div className='font-bold'>Avg. Penalties</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
		maxSize: 160,
		meta: {
			align: 'right',
		},
	}),
	helper.accessor('avgDefense', {
		header: () => <div className='font-bold'>Defense</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue() ?? 0) || 'none'}</div>,
		maxSize: 160,
		meta: {
			align: 'right',
		},
	}),
	/*
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
	*/
];
