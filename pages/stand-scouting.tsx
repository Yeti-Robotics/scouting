import StandForm from '@/components/Forms/StandForm';
import Layout from '@/components/Layout';
import { useUser } from '@/lib/useUser';
import { CircularProgress } from '@mui/material';

const StandScouting = () => {
	const { user, loading } = useUser();

	if (!user) {
		return (
			<Layout>
				<CircularProgress />
			</Layout>
		);
	}

	if (!user && !loading) {
		return (
			<Layout>
				<h1>You are not authorized.</h1>
			</Layout>
		);
	}

	return (
		<Layout>
			<StandForm create={true} canEdit={true} />
		</Layout>
	);
};

export default StandScouting;
