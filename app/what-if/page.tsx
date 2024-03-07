import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectItem } from '@/components/ui/select';
import Team from '@/models/Team';
import { erf } from 'mathjs';

export default async function WhatIfPage() {
	const teams = await Team.find({}).sort({ teamNumber: 1 });

	return (
		<main className='mx-auto mt-8 max-w-5xl'>
			<header>
				<h1 className='typography'>What If?</h1>
				<p className='lead max-w-[60ch]'>
					Compare potential outcomes with different alliances. Inspired by{' '}
					<a className='text-primary' href='https://www.statbotics.io/hypothetical'>
						Statbotics Hypotheticals
					</a>
					.
				</p>
			</header>
			<section className='grid grid-cols-2'>
				<form>
					<Card>
						<CardHeader>
							<CardTitle>Red Alliance</CardTitle>
						</CardHeader>
					</Card>
					<CardContent>
						<Select name='red-1'>
							{teams.map((team) => (
								<SelectItem key={team.teamNumber} value={team.teamNumber}>
									{team.teamNumber}
								</SelectItem>
							))}
						</Select>
						<Select name='red-2'></Select>
						<Select name='red-3'></Select>
					</CardContent>
				</form>
			</section>
		</main>
	);
}
