import Layout from '@/components/Layout';
import { useUser } from '@/lib/useUser';
import { CircularProgress } from '@mui/material';
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

	return (
		<Layout>
			<CircularProgress />
		</Layout>
	);
};

export default Logout;
