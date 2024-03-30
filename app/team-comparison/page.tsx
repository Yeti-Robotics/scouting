import { TableHead } from '@/components/ui/table';
import { connectToDbB } from '@/middleware/connect-db';
import StandForm from '@/models/StandForm';
import { teamDataAggregation } from '@/models/aggregations/teamData';
import { Suspense } from 'react';
import { TeamComparisonTable } from './TeamComparisonTable';

export default async function TeamComparisonPage() {
	await connectToDbB();
	const data = await StandForm.aggregate(teamDataAggregation);
	const teams = data
		.map((team) => ({ team_number: team.teamNumber, team_name: team.teamName }))
		.sort((a, b) => a.team_number - b.team_number);
	return (
		<main className='mx-auto my-8 max-w-3xl px-4 pb-16'>
			<header>
				<h1 className='typography'>Team Comparison</h1>
				<p className='lead max-w-[60ch]'>Compare between the statistics of two teams.</p>
			</header>
            <section className='mt-4'>
			<Suspense fallback={<div>Loading...</div>}>
					<TeamComparisonTable data={data} />
				</Suspense>
			</section>
		</main>
	);
}