import MatchForm from '@/components/Forms/MatchForm';
import { useUser } from '@/lib/useUser';
import { Loader } from '@mantine/core';

const CreateMatch = () => {
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });

	if (!user) return <Loader size='xl' />;

	if (user.banned) return <h1>You&#39;re banned you sussy baka.</h1>;

	return <MatchForm create={true} canEdit={user.administrator} />;
};

export default CreateMatch;
