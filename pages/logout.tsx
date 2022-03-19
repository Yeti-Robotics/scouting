import Layout from '@/components/Layout';
import fetcher from '@/lib/fetch';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const Logout = () => {
	const router = useRouter();
	const { data } = useSWR('/api/auth/logout', fetcher, { onSuccess: () => location.reload() });

	if (data) router.push('/');

	return (
		<Layout>
			<CircularProgress />
		</Layout>
	);
};

export default Logout;
