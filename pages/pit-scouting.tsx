import PitForm from '@/components/Forms/PitForm';
import Layout from '@/components/Layout';
import { useUser } from '@/lib/useUser';
import { CircularProgress } from '@mui/material';

const PitScouting = () => {
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
			<PitForm create={true} canEdit={true} />
		</Layout>
	);
};

export default PitScouting;
