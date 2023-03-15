import fetcher from '@/lib/fetch';
import { aggregatePiecesScored } from '@/lib/matchDataUtils';
import { useUser } from '@/lib/useUser';
import { MatchWForms } from '@/models/aggregations/matchWForms';
import { Card, Group, Loader, Stack, Title } from '@mantine/core';
import { useIsomorphicEffect } from '@mantine/hooks';
import { useState } from 'react';
import useSWR from 'swr';

const MatchCard = ({ match }: { match: MatchWForms }) => {
	const [errors, setErrors] = useState<string[]>([]);
	const { blue, red } = aggregatePiecesScored(match);

	// Match is guaranteed to have official prop if this component is rendered

	return (
		<Card withBorder shadow='md'>
			<Title>{match.matchNumber}</Title>
		</Card>
	);
};

const TBA = () => {
	useUser();
	const { data, mutate } = useSWR<MatchWForms[]>('/api/matches?withForms=true', fetcher);

	useIsomorphicEffect(() => {
		fetch('/api/matches/populate-official').then(() => mutate());
	}, []);

	if (!data) return <Loader size='xl' />;

	const completedMatches = data.filter((match) => match.official);

	return (
		<Stack>
			<Group position='center' align='center' p='md'>
				{completedMatches.map((match) => (
					<MatchCard match={match} key={match._id} />
				))}
			</Group>
		</Stack>
	);
};

export default TBA;
