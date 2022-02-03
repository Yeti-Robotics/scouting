import PitForm from '@/components/Forms/PitForm';
import Layout from '@/components/Layout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { PitFormI } from '@/models/PitForm';
import { PitImageRes } from '@/models/PitImage';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const PitFormPage = () => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: false });
	const { data, error } = useSWR<{ form: PitFormI; images: PitImageRes[] }>(
		router.isReady ? `/api/forms/pit/${router.query.id}` : null,
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

	if (!data.form._id) {
		return (
			<Layout>
				<h1>No form was found with this id.</h1>
			</Layout>
		);
	}

	const formattedData = { ...data };
	if (data.images[0]) {
		formattedData.images = (data.images as any).map((image: PitImageRes) => {
			return { ...image, data: Buffer.from(image.data.data) };
		});
	}

	return (
		<Layout>
			<PitForm
				create={false}
				canEdit={user?.administrator}
				defaultForm={formattedData.form}
				defaultImages={formattedData.images as any}
			/>
		</Layout>
	);
};

export default PitFormPage;
