import MatchForm from '@/components/Forms/MatchForm';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const EditMatch = () => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { data } = useSWR<MatchI>(
		router.isReady ? `/api/matches/${router.query.id}` : null,
		fetcher,
	);

	if (!user || !data) return <LoadingLayout />;

	if (user.banned)
		return (
			<Layout>
				<h1>You&#39;re banned you sussy baka.</h1>
			</Layout>
		);

	return (
		<Layout>
			<MatchForm
				create={false}
				canEdit={user.administrator}
				defaultMatch={data}
				id={String(router.query.id)}
			/>
		</Layout>
	);
};

export default EditMatch;
