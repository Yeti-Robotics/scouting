'use client';

import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import { Button } from '@/components/ui/button';
import { IconArrowsUpDown } from '@tabler/icons-react';
import { headers, headerGroups } from './constants';

function GroupRowCell({ children, ...props }: { children?: React.ReactNode; [x: string]: any }) {
	return (
		<TableHead className='border-x text-center font-semibold' {...props}>
			{children}
		</TableHead>
	);
}

function GroupRow() {
	return (
		<TableRow>
			{headerGroups.map(({ title, colSpan }, i) => (
				<GroupRowCell key={i} colSpan={colSpan}>
					{title}
				</GroupRowCell>
			))}
		</TableRow>
	);
}

export default function PicklistTableHeader({
	handleHeaderClick,
}: {
	handleHeaderClick: (id: keyof TeamDerivedStatsI) => void;
}) {
	return (
		<TableHeader>
			<GroupRow />
			<TableRow>
				<TableHead></TableHead>
				{headers.map(({ id, title }) => (
					<TableHead
						key={id}
						onClick={() => handleHeaderClick(id as keyof TeamDerivedStatsI)}
					>
						<Button variant='ghost'>
							{title}
							<IconArrowsUpDown className='ml-2 h-4 w-4' />
						</Button>
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	);
}
