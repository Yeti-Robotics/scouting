'use client';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import { createContext, useState, useMemo, Dispatch, SetStateAction, ReactNode } from 'react';

export const TeamsContext = createContext<{
	teams: TeamDerivedStatsI[];
	setTeams?: Dispatch<SetStateAction<TeamDerivedStatsI[]>>;
	items: number[];
	selected: Set<number>;
	setSelected?: Dispatch<SetStateAction<Set<number>>>;
}>({
	teams: [],
	items: [],
	selected: new Set(),
});

export default function TeamContextProvider({
	initialState,
	selectedTeams,
	children,
}: {
	initialState: TeamDerivedStatsI[];
	selectedTeams: Set<number>;
	children: ReactNode;
}) {
	const [teams, setTeams] = useState(initialState);
	const [selected, setSelected] = useState(selectedTeams);
	const items = useMemo(() => teams?.map(({ _id }) => _id), [teams]);
	return (
		<TeamsContext.Provider value={{ teams, setTeams, items, selected, setSelected }}>
			{children}
		</TeamsContext.Provider>
	);
}
