import StandForm from '@/components/Forms/StandForm';
import Layout from '@/components/Layout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { StandFormI } from '@/models/StandForm';
import { CircularProgress } from '@mui/material';
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
		return (
			<Layout>
				<CircularProgress />
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<h1>There was an error retrieving this form.</h1>
			</Layout>
		);
	}

	if (!data._id) {
		return (
			<Layout>
				<h1>No form was found with this id.</h1>
			</Layout>
		);
	}

	return (
		<Layout>
			<StandForm
				create={false}
				canEdit={user?.administrator}
				defaultForm={data}
				id={String(router.query.id)}
			/>
		</Layout>
	);
};

export default StandFormPage;
