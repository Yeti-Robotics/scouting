import MatchForm from '@/components/Forms/MatchForm';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import { useUser } from '@/lib/useUser';

const CreateMatch = () => {
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });

	if (!user) return <LoadingLayout />;

	if (user.banned)
		return (
			<Layout>
				<h1>You&#39;re banned you sussy baka.</h1>
			</Layout>
		);

	return (
		<Layout>
			<MatchForm create={true} canEdit={user.administrator} />
		</Layout>
	);
};

export default CreateMatch;
