'use client';

import { startTransition, SetStateAction, Dispatch } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import { TableCell, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { CheckIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { onMarkSelected, onMarkUnselected } from './actions';
import { headers } from './constants';

function SelectedDropdown({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: (() => void) | (() => Promise<void>);
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Pencil1Icon className='h-4 w-4 hover:cursor-pointer hover:stroke-primary' />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Edit Availability</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={onClick}>{children}</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default function DraggableRow({
	teamData,
	isSelected,
	optimisticallyChangeSelected,
	setSelected,
}: {
	teamData: TeamDerivedStatsI;
	isSelected: boolean;
	optimisticallyChangeSelected: (action: (c: Set<number>) => void) => void;
	setSelected: Dispatch<SetStateAction<Set<number>>> | undefined;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: teamData._id,
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handleSelect = async () => {
		startTransition(() => {
			optimisticallyChangeSelected((sel) => {
				sel.add(teamData._id);
			});
		});
		setSelected && setSelected(await onMarkSelected(teamData._id));
	};

	const handleUnselect = async () => {
		startTransition(() => {
			optimisticallyChangeSelected((sel) => {
				sel.delete(teamData._id);
			});
		});
		setSelected && setSelected(await onMarkUnselected(teamData._id));
	};

	return (
		<TableRow
			className={`relative ${isSelected && 'bg-destructive'} z-0 hover:cursor-grab hover:bg-muted active:z-50 active:cursor-grabbing`}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<TableCell className=''>
				<SelectedDropdown onClick={isSelected ? handleUnselect : handleSelect}>
					{isSelected ? (
						<>
							<TrashIcon className='mr-1 h-4 w-4' />
							Remove Selected
						</>
					) : (
						<>
							<CheckIcon className='mr-1 h-4 w-4' />
							Mark as Selected
						</>
					)}
				</SelectedDropdown>
			</TableCell>
			{headers.map(({ id }) => (
				<TableCell key={id}>
					{id === '_id'
						? teamData['_id']
						: Math.round(100 * teamData[id as keyof TeamDerivedStatsI]) / 100}
				</TableCell>
			))}
		</TableRow>
	);
}
