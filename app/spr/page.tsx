import verifyAdmin from '@/middleware/app-router/verify-user';
import { cookies } from 'next/headers';
import RecomputeButton from '@/components/ScoutPowerRanking/RecomputeButton';
import SPRLeaderboard from '@/components/ScoutPowerRanking/SPRLeaderboard';
import { Suspense } from 'react';
import { connectToDbB } from '@/middleware/connect-db';
import SPR from '@/models/SPR';
import { UserI } from '@/models/User';

export interface ScoutI {
	firstName?: string;
	lastName?: string;
	avgSPR: number;
}

interface AggregationScoutI {
	_id: string;
	avgSPR: number;
	scouter: (UserI | undefined)[];
}

const getData = async () => {
	await connectToDbB();
	const data = await SPR.aggregate<AggregationScoutI>([
		{
			$group: {
				_id: {
					$toObjectId: '$scouter',
				},
				avgSPR: {
					$avg: '$matchSPR',
				},
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: '_id',
				foreignField: '_id',
				as: 'scouter',
			},
		},
	]);

	const table: ScoutI[] = data
		.filter((scout) => scout.scouter !== undefined)
		.map((scout) => {
			return {
				firstName: scout.scouter[0]?.firstName || 'Unnamed',
				lastName: scout.scouter[0]?.lastName || 'Unnamed',
				avgSPR: scout.avgSPR,
			};
		});
	return table;
};

export default async function SPRDashboard() {
	const access_token = cookies().get('access_token');
	const isAdmin = await verifyAdmin(access_token?.value);
	const data = await getData();
	if (isAdmin) {
		return (
			<main className='mx-4 mt-10 max-w-7xl'>
				<header>
					<h1 className='typography'>SPR Table</h1>
				</header>
				<section className='mt-6'>
					<Suspense fallback={<div>Loading...</div>}>
						<SPRLeaderboard data={data} />
					</Suspense>
				</section>
				<RecomputeButton />
			</main>
		); // Component for admin users
	} else {
		return <div>NO</div>; // Component shown for unauthorized access
	}
}
