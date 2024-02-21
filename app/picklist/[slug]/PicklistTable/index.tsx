'use client';
import DraggableRow from './draggable-row';
import { useContext, useState, useOptimistic } from 'react';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	TouchSensor,
	MouseSensor,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import { Table, TableBody } from '@/components/ui/table';
import { TeamsContext } from '@/app/picklist/[slug]/team-context-provider';
import PicklistTableHeader from './table-header';

function sortTeams(
	data: TeamDerivedStatsI[],
	columnName: keyof TeamDerivedStatsI,
	ascending: boolean,
) {
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

export default function PickListTable() {
	const [sortColumn, setSortColumn] = useState<keyof TeamDerivedStatsI | undefined>(undefined);
	const [ascending, setAscending] = useState(false);
	const { teams, setTeams, items, selected, setSelected } = useContext(TeamsContext);
	const [optimisticSelected, optimisticallyChangeSelected] = useOptimistic(
		selected,
		(current: Set<number>, action: (c: Set<number>) => void) => {
			action(current);
			return new Set(current);
		},
	);

	const sensors = useSensors(
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 10,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 100,
				tolerance: 10,
				distance: 25,
			},
		}),
	);

	function handleHeaderClick(column: keyof TeamDerivedStatsI) {
		if (column === sortColumn && setTeams) {
			setTeams(sortTeams(teams, sortColumn, !ascending));
			setAscending((curr) => !curr);
		} else if (setTeams) {
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
		if (active && over && active.id !== over.id && setTeams) {
			setTeams((oldTeams) => {
				const oldIndex = items.indexOf(active.id as number);
				const newIndex = items.indexOf(over.id as number);
				return arrayMove(oldTeams, oldIndex, newIndex);
			});
			setSortColumn(undefined);
		}
	}

	return (
		<div className='touch-pan-y rounded-md border'>
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
			>
				<Table>
					<PicklistTableHeader handleHeaderClick={handleHeaderClick} />
					<TableBody>
						<SortableContext items={items} strategy={verticalListSortingStrategy}>
							{teams.map((team) => (
								<DraggableRow
									key={team._id}
									teamData={team}
									isSelected={optimisticSelected.has(team._id)}
									setSelected={setSelected}
									optimisticallyChangeSelected={optimisticallyChangeSelected}
								/>
							))}
						</SortableContext>
					</TableBody>
				</Table>
			</DndContext>
		</div>
	);
}
