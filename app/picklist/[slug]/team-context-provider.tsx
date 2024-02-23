'use client';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import { createContext, useState, useMemo, Dispatch, SetStateAction, ReactNode } from 'react';

export const TeamsContext = createContext<{
	teams: TeamDerivedStatsI[];
	setTeams?: Dispatch<SetStateAction<TeamDerivedStatsI[]>>;
	items: number[];
	selected: Map<number, number>;
	setSelected?: Dispatch<SetStateAction<Map<number, number>>>;
}>({
	teams: [],
	items: [],
	selected: new Map(),
});

export default function TeamContextProvider({
	initialState,
	selectedTeams,
	children,
}: {
	initialState: TeamDerivedStatsI[];
	selectedTeams: Map<number, number>;
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
