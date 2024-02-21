'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamsContext } from '../team-context-provider';
import { useContext } from 'react';

export default function BestAvailable() {
	const { teams, selected } = useContext(TeamsContext);
	const availableTeams = teams.filter((team) => !selected.has(team._id));

	return (
		<Card>
			<CardHeader className='p-6'>
				<CardTitle>Best Available</CardTitle>
			</CardHeader>
			<CardContent className='p-6 pt-0'>
				<h2 className='text-3xl font-bold'>Team {availableTeams[0]._id}</h2>
			</CardContent>
		</Card>
	);
}
