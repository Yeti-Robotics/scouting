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
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
// import { CreateForm, SelectPickList, UpdateButton } from './CUElements';
import { NewPicklistI } from '@/models/PickList';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
			className='relative active:z-50 hover:cursor-grab active:cursor-grabbing active:bg-primary'
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
			<TableCell>{Math.round(teamData.climbRate * 100) / 100}</TableCell>
			<TableCell>{Math.round(teamData.trapNotes * 100) / 100}</TableCell>
		</TableRow>
	);
}

export default function PickListTable({
	data,
}: {
	data: TeamDerivedStatsI[];
	picklists: NewPicklistI[];
}) {
	const [teams, setTeams] = useState(data);
	// Whenever teams updates, get the new id mapping
	const items = useMemo(() => teams?.map(({ _id }) => _id), [teams]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

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
		}
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
			>
				<Table className='max-w-540'>
					<TableHeader>
					<TableRow >
							<TableHead colSpan={3}></TableHead>
							<TableHead className='text-center' colSpan={2}>Auto</TableHead>
							<TableHead className='text-center' colSpan={3}>TeleOp</TableHead>
							<TableHead className='text-center' colSpan={2}>Endgame</TableHead>
						</TableRow>
						<TableRow>
							<TableHead>Number</TableHead>
							<TableHead>First Pickability</TableHead>
							<TableHead>Second Pickability</TableHead>
							<TableHead>Amp</TableHead>
							<TableHead>Speaker</TableHead>
							<TableHead>Amp</TableHead>
							<TableHead>Speaker</TableHead>
							<TableHead>Amplified Speaker</TableHead>
							<TableHead>Climb Rate</TableHead>
							<TableHead>Trap Notes</TableHead>
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
		</>
	);
}
