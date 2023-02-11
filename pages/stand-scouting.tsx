import StandForm from '@/components/Forms/StandForm';
import { useUser } from '@/lib/useUser';
import { Loader } from '@mantine/core';

const StandScouting = () => {
	const { user, loading } = useUser();

	if (!user) {
		return <Loader size='xl' />;
	}

	if (!user && !loading) {
		return <h1>You are not authorized.</h1>;
	}

	return <StandForm create={true} canEdit={true} />;
};

export default StandScouting;
