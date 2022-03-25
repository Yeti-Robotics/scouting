import Layout from '@/components/Layout';
import Paginator from '@/components/Paginator';
import UserDisplay from '@/components/Paginator/Users/UserDisplay';
import UserFilter from '@/components/Paginator/Users/UserFilter';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { CircularProgress } from '@mui/material';

const Users = () => {
	const { user } = useUser({ redirectIfNotAdmin: true, redirectTo: '/records' });

	if (!user) {
		return <CircularProgress />;
	}

	return (
		<Layout>
			<Paginator
				object={{} as UserI}
				route='/api/auth/users'
				Filter={UserFilter}
				Display={UserDisplay}
			/>
		</Layout>
	);
};

export default Users;
