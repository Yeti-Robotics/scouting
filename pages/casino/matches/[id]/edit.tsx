import MatchForm from '@/components/Forms/MatchForm';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const EditMatch = () => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { data } = useSWR<MatchI>(
		router.isReady ? `/api/matches/${router.query.id}` : null,
		fetcher,
	);

	if (!user || !data) return <Loader size='xl' />;

	if (user.banned) return <h1>You&#39;re banned you sussy baka.</h1>;

	return (
		<MatchForm
			create={false}
			canEdit={user.administrator}
			defaultMatch={data}
			id={String(router.query.id)}
		/>
	);
};

export default EditMatch;
