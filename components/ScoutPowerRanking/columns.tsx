'use client';

import { ScoutI } from '@/app/spr/page';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from '@/components/Link';

const helper = createColumnHelper<ScoutI>();

export const columns = [
	helper.accessor('firstName', {
		header: () => <div className='font-bold'>First Name</div>,
		cell: (props) => <Link href={`/teams/${props.getValue()}`}>{props.getValue()}</Link>,
		// in px
		maxSize: 112,
		meta: {
			align: 'left',
		},
	}),
	helper.accessor('lastName', {
		header: () => <div className='font-bold'>Last Name</div>,
		cell: (props) => <>{props.getValue()}</>,
		maxSize: 288,
		meta: {
			align: 'left',
		},
	}),
	helper.accessor('avgSPR', {
		header: () => <div className='font-bold'>Avg SPR</div>,
		cell: (props) => <>{props.getValue()}</>,
		maxSize: 288,
		meta: {
			align: 'left',
		},
	}),
	helper.accessor('count', {
		header: () => <div className='font-bold'>Count</div>,
		cell: (props) => <>{props.getValue()}</>,
		maxSize: 288,
		meta: {
			align: 'left',
		},
	}),
];
