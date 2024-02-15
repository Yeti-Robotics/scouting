'use client';
import { useMemo, useState } from 'react';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
// import { CreateForm, SelectPickList, UpdateButton } from './CUElements';
import PickList, { NewPicklistI } from '@/models/PickList';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import { IconArrowsUpDown } from '@tabler/icons-react';

const headers = [
	{ id: '_id', title: 'Team Number' },
	{ id: 'firstPickability', title: 'First Pickability' },
	{ id: 'secondPickability', title: 'Second Pickability' },
	{ id: 'autoAmpNotes', title: 'Amp' },
	{ id: 'autoSpeakerNotes', title: 'Speaker' },
	{ id: 'teleopAmpNotes', title: 'Amp' },
	{ id: 'teleopSpeakerNotes', title: 'Speaker' },
	{ id: 'teleopAmplifiedSpeakerNotes', title: 'Amplified Notes' },
	{ id: 'climbRate', title: 'Climb Rate' },
	{ id: 'trapNotes', title: 'Trap Notes' },
];

function DraggableRow({ teamData }: { teamData: TeamDerivedStatsI }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: teamData._id,
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<TableRow
			className='relative hover:cursor-grab active:z-50 active:cursor-grabbing active:bg-primary'
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<TableCell>{teamData._id}</TableCell>
			<TableCell>{Math.round(teamData.firstPickability * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.secondPickability * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.autoAmpNotes * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.autoSpeakerNotes * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.teleopAmpNotes * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.teleopSpeakerNotes * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.teleopAmplifiedSpeakerNotes * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.climbRate * 100) / 100}%</TableCell>
			<TableCell>{Math.round(teamData.trapNotes * 100) / 100}</TableCell>
		</TableRow>
	);
}
type ColumnsT = keyof TeamDerivedStatsI;

function sortTeams(data: TeamDerivedStatsI[], columnName: ColumnsT, ascending: boolean) {
	return [...data].sort((teamA, teamB) => {
		return ascending
			? teamA[columnName] < teamB[columnName]
				? -1
				: 1
			: teamA[columnName] < teamB[columnName]
				? 1
				: -1;
	});
}

export default function PickListTable({
	data,
}: {
	data: TeamDerivedStatsI[];
	picklist: NewPicklistI;
}) {
	const [sortColumn, setSortColumn] = useState<ColumnsT | undefined>(undefined);
	const [ascending, setAscending] = useState(false);
	const [teams, setTeams] = useState(data);
	// Whenever teams updates, get the new id mapping
	const items = useMemo(() => teams?.map(({ _id }) => _id), [teams]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	console.log(teams);

	function handleHeaderClick(column: ColumnsT) {
		if (column === sortColumn) {
			setTeams(sortTeams(teams, sortColumn, !ascending));
			setAscending((curr) => !curr);
		} else {
			setTeams(sortTeams(teams, column, false));
			setAscending(false);
			setSortColumn(column);
		}
	}

	/**
	 * On end of drag, update teams to match new teams
	 * @param event
	 */
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setTeams((oldTeams) => {
				const oldIndex = items.indexOf(active.id as number);
				const newIndex = items.indexOf(over.id as number);
				return arrayMove(oldTeams, oldIndex, newIndex);
			});
			setSortColumn(undefined);
		}
	}

	return (
		<div className='rounded-md border'>
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
			>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead colSpan={3}></TableHead>
							<TableHead className='border-x text-center font-semibold' colSpan={2}>
								Auto
							</TableHead>
							<TableHead className='border-x text-center font-semibold' colSpan={3}>
								TeleOp
							</TableHead>
							<TableHead className='border-x text-center font-semibold' colSpan={2}>
								Endgame
							</TableHead>
						</TableRow>
						<TableRow>
							{headers.map(({ id, title }) => (
								<TableHead
									key={id}
									onClick={() => handleHeaderClick(id as ColumnsT)}
								>
									<Button variant='ghost'>
										{title}
										<IconArrowsUpDown className='ml-2 h-4 w-4' />
									</Button>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<SortableContext items={items} strategy={verticalListSortingStrategy}>
							{teams.map((team) => (
								<DraggableRow key={team._id} teamData={team} />
							))}
						</SortableContext>
					</TableBody>
				</Table>
			</DndContext>
		</div>
	);
}
