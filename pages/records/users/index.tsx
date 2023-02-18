import Paginator from '@/components/Paginator';
import UserDisplay from '@/components/Paginator/Users/UserDisplay';
import UserFilter from '@/components/Paginator/Users/UserFilter';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Loader } from '@mantine/core';

const Users = () => {
	const { user } = useUser({ redirectIfNotAdmin: true, redirectTo: '/records' });

	if (!user) {
		return <Loader size='xl' />;
	}

	return (
		<Paginator
			object={{} as UserI}
			route='/api/auth/users'
			Filter={UserFilter}
			Display={UserDisplay}
		/>
	);
};

export default Users;
