import { TeamDataTable } from '@/components/TeamDataTable';
import { connectToDbB } from '@/middleware/connect-db';
import StandForm from '@/models/StandForm';
import { teamDataAggregation } from '@/models/aggregations/teamData';
import { Suspense } from 'react';

const Teams = async () => {
	await connectToDbB();
	const data = await StandForm.aggregate(teamDataAggregation);
	if (!data) return <div>Could not fetch data</div>;

	return (
		<main className='mx-4 mt-10 max-w-7xl'>
			<header>
				<h1 className='typography'>Team Data Table</h1>
				<p className='lead'>Aggregated data for teams</p>
			</header>
			<section className='mt-6'>
				<Suspense fallback={<div>Loading...</div>}>
					<TeamDataTable data={data} />
				</Suspense>
			</section>
		</main>
	);
};

export default Teams;

export const revalidate = 60;
