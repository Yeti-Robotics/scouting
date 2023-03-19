import fetcher from '@/lib/fetch';
import { aggregatePiecesScored } from '@/lib/matchDataUtils';
import { useUser } from '@/lib/useUser';
import { MatchWForms } from '@/models/aggregations/matchWForms';
import { Card, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useIsomorphicEffect } from '@mantine/hooks';
import useSWR from 'swr';

const MatchCard = ({ match }: { match: MatchWForms }) => {
	const blueErrors: string[] = [];
	const redErrors: string[] = [];

	// Our data
	const { blue, red } = aggregatePiecesScored(match);
	// TBA data, guaranteed to have official prop if this component is rendered
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { blue: tbaBlue, red: tbaRed } = match.official!;
	console.log({ blue, red });
	console.log({ tbaBlue, tbaRed });

	// ============= Blue Validations =============
	blue.highCubes !== tbaBlue.highCubes && blueErrors.push('Blue Cubes High');
	blue.highCones !== tbaBlue.highCones && blueErrors.push('Blue Cones High');

	blue.midCubes !== tbaBlue.midCubes && blueErrors.push('Blue Cubes Mid');
	blue.midCones !== tbaBlue.midCones && blueErrors.push('Blue Cones Mid');

	blue.lowCubes !== tbaBlue.lowCubes && blueErrors.push('Blue Cubes Low');
	blue.lowCones !== tbaBlue.lowCones && blueErrors.push('Blue Cones Low');

	// ============= Red Validations =============
	red.highCubes !== tbaRed.highCubes && redErrors.push('Red Cubes High');
	red.highCones !== tbaRed.highCones && redErrors.push('Red Cones High');

	red.midCubes !== tbaRed.midCubes && redErrors.push('Red Cubes Mid');
	red.midCones !== tbaRed.midCones && redErrors.push('Red Cones Mid');

	red.lowCubes !== tbaRed.lowCubes && redErrors.push('Red Cubes Low');
	red.lowCones !== tbaRed.lowCones && redErrors.push('Red Cones Low');

	return (
		<Card withBorder shadow='xl'>
			<Title align='center'>Match {match.matchNumber}</Title>
			<Group align='flex' position='center'>
				<Paper bg='blue' p='xs' withBorder>
					<Stack>
						<Title order={2}>Blue</Title>
						{blueErrors.length === 0 ? (
							<Text>No Errors 😁</Text>
						) : (
							blueErrors.map((err, i) => <Text key={i}>{err}</Text>)
						)}
					</Stack>
				</Paper>
				<Paper bg='red' p='xs' withBorder>
					<Stack>
						<Title order={2}>Red</Title>
						{redErrors.length === 0 ? (
							<Text>No Errors 😁</Text>
						) : (
							redErrors.map((err, i) => <Text key={i}>{err}</Text>)
						)}
					</Stack>
				</Paper>
			</Group>
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
