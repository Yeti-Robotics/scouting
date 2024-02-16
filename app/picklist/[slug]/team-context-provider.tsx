'use client';
import { TeamDerivedStatsI } from '@/lib/types/Pickability';
import { createContext, useState, useMemo, Dispatch, SetStateAction, ReactNode } from 'react';

export const TeamsContext = createContext<{
	teams: TeamDerivedStatsI[];
	setTeams?: Dispatch<SetStateAction<TeamDerivedStatsI[]>>;
	items: number[];
}>({
	teams: [],
	items: [],
});

export default function TeamContextProvider({
	initialState,
	children,
}: {
	initialState: TeamDerivedStatsI[];
	children: ReactNode;
}) {
	const [teams, setTeams] = useState(initialState);
	const items = useMemo(() => teams?.map(({ _id }) => _id), [teams]);
	return (
		<TeamsContext.Provider value={{ teams, setTeams, items }}>{children}</TeamsContext.Provider>
	);
}
