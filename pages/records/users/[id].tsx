import { UserForm } from '@/components/Forms/UserForm';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const StandFormPage = () => {
	const router = useRouter();
	const { user } = useUser();
	const { data, error } = useSWR<UserI>(
		router.isReady ? `/api/auth/users/${router.query.id}` : null,
		fetcher,
	);

	if (!data) {
		return <Loader size='xl' />;
	}

	if (error) {
		return <h1>There was an error retrieving this form.</h1>;
	}

	if (!data._id) {
		return <h1>No form was found with this id.</h1>;
	}

	return (
		<UserForm
			create={false}
			canEdit={user?.administrator}
			defaultUser={data}
			id={String(router.query.id)}
		/>
	);
};

export default StandFormPage;
