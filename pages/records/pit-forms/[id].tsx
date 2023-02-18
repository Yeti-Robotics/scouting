import { PitForm } from '@/components/Forms/PitForm';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { PitFormI } from '@/models/PitForm';
import { PitImageRes } from '@/models/PitImage';
import { Loader } from '@mantine/core';
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
		return <Loader size='xl' />;
	}

	if (error) {
		return <h1>There was an error retrieving this form.</h1>;
	}

	if (!data.form || !data.form._id) {
		return <h1>No form was found with this id.</h1>;
	}

	const formattedData = { ...data };
	if (data.images[0]) {
		console.log(data.images);
		formattedData.images = (data.images as any).map((image: PitImageRes) => {
			return { ...image, data: Buffer.from(image.data.data) };
		});
	}

	return (
		<PitForm
			create={false}
			canEdit={user?.administrator}
			defaultForm={formattedData.form}
			defaultImages={formattedData.images as any}
			id={String(router.query.id)}
		/>
	);
};

export default PitFormPage;
