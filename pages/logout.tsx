import { useUser } from '@/lib/useUser';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Logout = () => {
	const router = useRouter();
	const { mutate } = useUser({ canRedirect: false });

	useEffect(() => {
		fetch('/api/auth/logout').then(() => {
			document.cookie = 'access_token="";Max-Age=1';
			mutate().then(() => router.push('/'));
		});
	}, []);

	return <Loader size='xl' />;
};

export default Logout;
