import { useUser } from '@/lib/useUser';
import ScoutErrorTable from '@/components/ScoutError';
import useSWR from 'swr';
import fetcher from '@/lib/fetch';
import { UserI } from '@/models/User';
import { Loader } from '@mantine/core';

const ScoutErrorRanking = () => {
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<UserI[]>('/api/leaderboard', fetcher);

	if (!user?.administrator) {
		return <h1>You are not authorized.</h1>;
	}

	if (!data) return <Loader size='xl' />;

	return <ScoutErrorTable data={data} />;
};

export default ScoutErrorRanking;
