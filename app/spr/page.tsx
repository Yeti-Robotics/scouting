import verifyAdmin from '@/middleware/app-router/verify-admin';
import { cookies } from 'next/headers';
import RecomputeButton from './recomputeButton';
import SPRLeaderboard from './sprLeaderboard';
import { Suspense } from 'react';
import { connectToDbB } from '@/middleware/connect-db';
import SPR from '@/models/SPR';
import { UserI } from '@/models/User';

export interface ScoutI {
	firstName: string;
	lastName: string;
	avgSPR: number;
}

interface AggregationScoutI {
	_id: string;
	avgSPR: number;
	scouter: UserI[];
}

const getData = async () => {
	await connectToDbB();
	const data = await SPR.aggregate<AggregationScoutI>([
		{
			$group: {
				_id: '$scouter',
				avgSPR: { $avg: '$matchSPR' },
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: '_id',
				foreignField: 'username',
				as: 'scouter',
			},
		},
	]);

	const table: ScoutI[] = data
		.filter((scout) => scout.scouter !== undefined)
		.map((scout) => {
			return {
				firstName: scout.scouter[0].firstName,
				lastName: scout.scouter[0].lastName,
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
			<main className='mx-auto flex max-w-[540px] flex-wrap items-center'>
				<h1 className='my-0 text-yeti-blue'>SPR Leaderboard</h1>
				<div className='w-full'>
					<Suspense fallback={<div>Loading...</div>}>
						<SPRLeaderboard data={data} />
					</Suspense>
				</div>
				<RecomputeButton />
			</main>
		); // Component for admin users
	} else {
		return <div>NO</div>; // Component shown for unauthorized access
	}
}