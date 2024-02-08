'use client';

import { NewPicklistI, PickListI } from '@/models/PickList';
import { useState, FormEvent, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';

export function CreateForm({ ordering }: { ordering: number[] }) {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		fetch('/api/picklist', {
			method: 'POST',
			body: JSON.stringify({
				name: data.get('pickList_name'),
				ordering,
			}),
		});
		event;
	}

	return (
		<form onSubmit={handleSubmit}>
			<input type='text' name='pickList_name' />
			<button type='submit'>Create Picklist</button>
		</form>
	);
}

interface SelectPickListPropsI {
	ordering: number[];
	setTeams: Dispatch<SetStateAction<TeamDerivedStatsI[]>>;
	picklists: NewPicklistI[];
}

export function SelectPickList({ ordering, setTeams, picklists }: SelectPickListPropsI) {
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setTeams((teams) => {
			const newTeams = Array(teams.length);
			const newOrdering = picklists[parseInt(e.target.value)].ordering;
			for (let i = 0; i < teams.length; i += 1) {
				newTeams[i] = teams[ordering.indexOf(newOrdering[i])];
			}
			return newTeams;
		});
	};

	return (
		<select defaultValue={-1} onChange={handleChange}>
			<option key={-1} disabled value={-1}>
				select a picklist
			</option>
			{picklists.map((picklist, index) => {
				return (
					<option key={index} value={`${index}`}>
						{picklist.name}
					</option>
				);
			})}
		</select>
	);
}

export function UpdateButton() {}
