import { ScoringGraph } from '@/components/MatchData/ScoringGraph';
import Comments from '@/components/MatchData/Comments';
import Taxis from '@/components/MatchData/Taxis';
import fetcher from '@/lib/fetch';
import { MatchData } from '@/models/aggregations/matchData';
import { Box, Loader, Title } from '@mantine/core';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

export const Data = ({ matchNumber }: { matchNumber: number }) => {
	const { data: id } = useSWRImmutable<string>(
		`/api/matches/num-to-id?number=${matchNumber}`,
		fetcher,
	);
	const { data } = useSWR<MatchData>(id ? `/api/matches/${id}/data` : null, fetcher);

	if (!data) return <Loader size='xl' />;

	const noData =
		!data.blue1 && !data.blue2 && !data.blue3 && !data.red1 && !data.red2 && !data.red3;

	if (noData) return <Title align='center'>There is no data on this match 😔</Title>;

	return (
		<>
			<Title order={2} align='center'>
				Scoring
			</Title>

			<Box w='100%' ta='center'>
				<ScoringGraph match={data} auto={false} level='amp' />
				<ScoringGraph match={data} auto={false} level='speaker' />
				<ScoringGraph match={data} auto level='amp' />
				<ScoringGraph match={data} auto level='speaker' />
			</Box>

			<Taxis match={data} />
			<Comments match={data} />
		</>
	);
};
