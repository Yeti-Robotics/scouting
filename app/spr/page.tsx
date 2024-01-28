import verifyAdmin from '@/middleware/app-router/verify-admin';
import { cookies } from 'next/headers';
import RecomputeButton from './recomputeButton';
import SPRLeaderboard from './sprLeaderboard';
import { Suspense } from 'react';
import { connectToDbB } from '@/middleware/connect-db';
import SPR from '@/models/SPR';
import { cache } from 'react';

const getTime = cache(async () => new Date().toISOString());

const getData = cache(async () => {
	await connectToDbB();
	console.log('query ran');
	const data = await SPR.aggregate([
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

	const table = data.map((scout) => {
		if (scout.scouter.length === 1) {
			return {
				firstName: scout.scouter[0].firstName,
				lastName: scout.scouter[0].lastName,
				avgSPR: scout.avgSPR,
			};
		}
	});

	return table;
});

export const revalidate = 3600;

export default async function SPRDashboard() {
	const access_token = cookies().get('access_token');
	const isAdmin = await verifyAdmin(access_token?.value);
	const data = await getData();
	const time = getTime();
	if (isAdmin) {
		return (
			<main className='mx-auto max-w-[540px]'>
				<div>{await time}</div>
				<RecomputeButton />
				<div>
					<Suspense fallback={<div>Loading...</div>}>
						<SPRLeaderboard data={data} />
					</Suspense>
				</div>
			</main>
		); // Component for admin users
	} else {
		return <div>NO</div>; // Component shown for unauthorized access
	}
}
