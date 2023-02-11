import PitForm from '@/components/Forms/PitForm';
import { useUser } from '@/lib/useUser';
import { Loader } from '@mantine/core';

const PitScouting = () => {
	const { user, loading } = useUser();

	if (!user) {
		return <Loader size='xl' />;
	}

	if (!user && !loading) {
		return <h1>You are not authorized.</h1>;
	}

	return <PitForm create={true} canEdit={true} />;
};

export default PitScouting;
