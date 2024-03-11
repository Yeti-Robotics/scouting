'use client';

import { RawTeamData } from '@/models/aggregations/teamData';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';

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
		cell: (props) => (
			<Link
				className='w-full text-primary hover:underline'
				href={`/teams/${props.getValue()}`}
			>
				{props.getValue()}
			</Link>
		),
		// in px
		meta: {
			align: 'left',
			className: 'sticky left-0 top-[40px] z-[39]',
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
				Amp Averages
			</div>
		),
		size: 200,
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
				Speaker Averages
			</div>
		),
		size: 260,
		columns: [
			helper.accessor('avgAutoSpeakerNotes', {
				header: () => <div className='font-bold'>Auto</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				meta: {
					align: 'right',
				},
				size: 85,
			}),
			helper.accessor('avgTeleopSpeakerNotes', {
				header: () => <div className='font-bold'>Teleop</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('avgTeleopAmplifiedSpeakerNotes', {
				header: () => <div className='font-bold'>Teleop Amplified</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				meta: {
					align: 'right',
				},
			}),
		],
	}),
	helper.accessor('avgShuttleNotes', {
		header: () => <div className='font-bold'>Shuttle</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
		meta: {
			align: 'right',
		},
		maxSize: 160,
	}),
	helper.accessor('avgTrapNotes', {
		header: () => <div className='font-bold'>Trap</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
		meta: {
			align: 'right',
		},
		maxSize: 160,
	}),
	helper.accessor('avgNotesMissed', {
		header: () => <div className='font-bold'>Avg. Notes Missed</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
		meta: {
			align: 'right',
		},
		maxSize: 160,
	}),
	helper.accessor('avgDefense', {
		header: () => <div className='font-bold'>Defense</div>,
		cell: (props) => <div className=''>{truncDecimals(props.getValue() ?? 0) || 'none'}</div>,
		maxSize: 160,
		meta: {
			align: 'right',
		},
	}),
	helper.group({
		id: 'advanced',
		header: () => (
			<div className='flex h-full w-full items-center justify-center text-center font-bold'>
				Advanced & Experimental
			</div>
		),
		columns: [
			helper.accessor('epa', {
				header: () => <div className='font-bold'>EPA</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('avgAutoScore', {
				header: () => <div className='font-bold'>aEPA</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('avgTeleopScore', {
				header: () => <div className='font-bold'>tEPA</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('avgEndScore', {
				header: () => <div className='font-bold'>eEPA</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('WPA', {
				header: () => <div className='font-bold'>WPA</div>,
				cell: (props) => <div className=''>{percentageFormatter(props.getValue())}</div>,
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('autoWPA', {
				header: () => <div className='font-bold'>Auto WPA</div>,
				cell: (props) => <div className=''>{percentageFormatter(props.getValue())}</div>,
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('autoConsistency', {
				header: () => <div className='font-bold'>Auto %RSD</div>,
				cell: (props) => (
					<div className=''>
						{props.getValue() === null ? '' : truncDecimals(props.getValue())}
					</div>
				),
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('effectiveNotePercentage', {
				header: () => <div className='font-bold'>eNote%</div>,
				cell: (props) => (
					<div className=''>{percentageFormatter(100 * props.getValue())}</div>
				),
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
			helper.accessor('teleopSpeakerAmplifiedRatio', {
				header: () => <div className='font-bold'>tASN/tSN</div>,
				cell: (props) => <div className=''>{truncDecimals(props.getValue())}</div>,
				maxSize: 160,
				meta: {
					align: 'right',
				},
			}),
		],
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
