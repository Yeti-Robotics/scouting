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
import { headers, allianceBgColors } from './constants';
import { Button } from '@/components/ui/button';

function SelectedDropdown({ children }: { children: React.ReactNode }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Pencil1Icon className='h-4 w-4 hover:cursor-pointer hover:stroke-primary' />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Edit Availability</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default function DraggableRow({
	teamData,
	alliance,
	optimisticallyChangeSelected,
	setSelected,
}: {
	teamData: TeamDerivedStatsI;
	alliance: number | undefined;
	optimisticallyChangeSelected: (action: (c: Map<number, number>) => void) => void;
	setSelected: Dispatch<SetStateAction<Map<number, number>>> | undefined;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: teamData._id,
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handleSelect = async (allianceNumber: number) => {
		startTransition(() => {
			optimisticallyChangeSelected((sel) => {
				sel.set(teamData._id, allianceNumber);
			});
		});
		setSelected && setSelected(await onMarkSelected(teamData._id, allianceNumber));
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
			className={` relative transition-colors duration-500 ${alliance && allianceBgColors[alliance - 1]} z-0 hover:cursor-grab hover:bg-muted active:z-50 active:cursor-grabbing`}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<TableCell className=''>
				<SelectedDropdown>
					{alliance ? (
						<DropdownMenuItem onClick={handleUnselect}>
							<TrashIcon className='h-4 w-4 hover:cursor-pointer hover:stroke-destructive' />
							<span className='ml-2'>Remove Alliance</span>
						</DropdownMenuItem>
					) : (
						[1, 2, 3, 4, 5, 6, 7, 8].map((allianceNumber) => {
							return (
								<DropdownMenuItem
									key={allianceNumber}
									onClick={() => handleSelect(allianceNumber)}
									className='flex items-center hover:cursor-pointer'
								>
									<span
										className={`mr-2 h-4 w-4 rounded-sm hover:cursor-pointer ${allianceBgColors[allianceNumber - 1]}`}
									/>
									Alliance {allianceNumber}
								</DropdownMenuItem>
							);
						})
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
