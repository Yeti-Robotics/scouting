import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Team, { TeamI } from '@/models/Team';
import TeamSelect from './TeamSelect';
import AllianceComparison from './AllianceComparison';

export default async function WhatIfPage() {
	const teams: TeamI[] = (await Team.find({}).sort({ team_number: 1 })).map(
		({ _id, team_name, team_number }) => ({ _id: _id.toString(), team_name, team_number }),
	);

	return (
		<main className='mx-auto my-8 max-w-3xl px-4 pb-16'>
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

			<section className='mt-4'>
				<AllianceComparison teams={teams} />
			</section>
		</main>
	);
}
