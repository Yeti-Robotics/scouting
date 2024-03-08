import AllianceComparison from './AllianceComparison';
import StandForm from '@/models/StandForm';
import { teamDataAggregation } from '@/models/aggregations/teamData';

export default async function WhatIfPage() {
	const data = await StandForm.aggregate(teamDataAggregation);
	const teams = data
		.map((team) => ({ team_number: team.teamNumber, team_name: team.teamName }))
		.sort((a, b) => a.team_number - b.team_number);

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
				<AllianceComparison teams={teams} data={data} />
			</section>
		</main>
	);
}

export const revalidate = 300; // revalidate cache every 5 minutes
