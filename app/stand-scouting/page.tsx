import StandForm from '@/components/Forms/StandForm';
import { verifyUser } from '@/middleware/app-router/verify-user';
import { cookies } from 'next/headers';

export default async function StandFormPage() {
	const access_token = cookies().get('access_token')?.value;
	const { _id, isBanned } = await verifyUser(access_token);

	if (!_id || isBanned) return <div>Unauthorized</div>;

	return (
		<main className='mx-auto flex w-full max-w-[360px] flex-wrap items-center justify-center py-8'>
			<h1 className='typography mb-6 w-full'>Stand Form</h1>
			<StandForm create canEdit />
		</main>
	);
}
