import StandForm from '@/components/Forms/StandForm';
import Layout from '@/components/Layout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { CreateStandForm, StandFormI } from '@/models/StandForm';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const StandFormPage = () => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const { data, error } = useSWR<StandFormI>(
		router.isReady ? `/api/forms/stand/${router.query.id}` : null,
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
		<Layout>
			<StandForm
				create={false}
				canEdit={user?.administrator}
				defaultForm={data as unknown as CreateStandForm}
				id={String(router.query.id)}
			/>
		</Layout>
	);
};

export default StandFormPage;
