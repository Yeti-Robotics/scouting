//import ScoutErrorTable from '@/components/ScoutError';
import ScoutErrorTable from '@/components/ScoutError';
import verifyAdmin from '@/middleware/app-router/verify-admin';
import { cookies } from 'next/headers';
import RecomputeButton from './recomputeButton';

export default async function SPRDashboard() {
	const access_token = cookies().get('access_token');
	const isAdmin = await verifyAdmin(access_token?.value);

	if (isAdmin) {
		return (
			<main>
				<RecomputeButton />
			</main>
		); // Component for admin users
	} else {
		return <div>NO</div>; // Component shown for unauthorized access
	}
}
