import { useUser } from '@/lib/useUser';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Logout = () => {
	const router = useRouter();
	const { mutate } = useUser({ canRedirect: false });

	useEffect(() => {
		fetch('/api/auth/logout').then(() => {
			mutate();
			router.push('/');
		});
	}, []);

	return <Loader size='xl' />;
};

export default Logout;
