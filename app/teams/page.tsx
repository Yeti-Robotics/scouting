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
		<div>
			<Suspense fallback={<div>Loading...</div>}>
				<TeamDataTable data={data} />
			</Suspense>
		</div>
	);
};

export default Teams;

export const revalidate = 60;
