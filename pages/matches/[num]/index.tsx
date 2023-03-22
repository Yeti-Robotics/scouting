import { ScoringGraph } from '@/components/MatchData/ScoringGraph';
import Comments from '@/components/MatchData/Comments';
import Taxis from '@/components/MatchData/Taxis';
import fetcher from '@/lib/fetch';
import { MatchData } from '@/models/aggregations/matchData';
import { Loader } from '@mantine/core';
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

	if (!data) return <Loader size='xl' />;

	return (
		<>
			<h1>Match {router.query.num}</h1>
			<h1>Scoring</h1>

			<div style={{ width: '100%', textAlign: 'center' }}>
				<ScoringGraph match={data} auto={false} level='top' piece='cone' />
				<ScoringGraph match={data} auto={false} level='top' piece='cube' />
				<ScoringGraph match={data} auto={false} level='mid' piece='cone' />
				<ScoringGraph match={data} auto={false} level='mid' piece='cube' />
				<ScoringGraph match={data} auto={false} level='low' piece='cone' />
				<ScoringGraph match={data} auto={false} level='low' piece='cube' />
				<ScoringGraph match={data} auto level='top' piece='cone' />
				<ScoringGraph match={data} auto level='top' piece='cube' />
				<ScoringGraph match={data} auto level='mid' piece='cone' />
				<ScoringGraph match={data} auto level='mid' piece='cube' />
				<ScoringGraph match={data} auto level='low' piece='cone' />
				<ScoringGraph match={data} auto level='low' piece='cube' />
			</div>

			<Taxis match={data} />
			<Comments match={data} />
		</>
	);
};

export default Match;
