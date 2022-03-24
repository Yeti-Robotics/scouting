import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import ShootingTable from '@/components/MatchData/ShootingTable';
import fetcher from '@/lib/fetch';
import { MatchData } from '@/models/aggregations/matchData';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const Match = () => {
	const router = useRouter();
	const { data: id } = useSWRImmutable<string>(
		router.isReady ? `/api/matches/num-to-id?number=${Number(router.query.num)}` : null,
		fetcher,
	);
	const { data } = useSWR<MatchData>(id ? `/api/matches/${id}/data` : null, fetcher);

	if (!data) return <LoadingLayout />;

	return (
		<Layout>
			<h1>Match {router.query.num}</h1>
			<ShootingTable match={data} auto={false} low={false} />
			<ShootingTable match={data} auto={false} low />
			<ShootingTable match={data} auto low={false} />
			<ShootingTable match={data} auto low />
		</Layout>
	);
};

export default Match;
