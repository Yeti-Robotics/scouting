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
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { TeamDerivedStatsI } from './page';
import { CreateForm, SelectPickList, UpdateButton } from './CUElements';
import { NewPicklistI, PickListI } from '@/models/PickList';

function DraggableRow({ teamData }: { teamData: TeamDerivedStatsI }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: teamData._id,
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<tr
			className='hover:cursor-grab active:cursor-grabbing'
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<td>{teamData._id}</td>
			<td>{Math.round(teamData.firstPickability * 100) / 100}</td>
			<td>{Math.round(teamData.secondPickability * 100) / 100}</td>
		</tr>
	);
}

export default function PickListTable({ data, picklists }: { data: TeamDerivedStatsI[], picklists: NewPicklistI[] }) {
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
		<CreateForm ordering={items}/>
		<SelectPickList ordering={items} setTeams={setTeams} picklists={picklists} />
		<DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
			<table className='max-w-540'>
				<thead>
					<tr>
						<th>Number</th>
						<th>First Pickability</th>
						<th>Second Pickability</th>
					</tr>
				</thead>
				<tbody>
					<SortableContext items={items} strategy={verticalListSortingStrategy}>
						{teams.map((team) => (
							<DraggableRow key={team._id} teamData={team} />
						))}
					</SortableContext>
				</tbody>
			</table>
		</DndContext>
		</>
	);
}
