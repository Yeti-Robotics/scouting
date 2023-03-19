import fetcher from '@/lib/fetch';
import { aggregatePiecesScored } from '@/lib/matchDataUtils';
import { useUser } from '@/lib/useUser';
import { MatchWForms } from '@/models/aggregations/matchWForms';
import { Card, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useIsomorphicEffect } from '@mantine/hooks';
import useSWR from 'swr';

const MatchCard = ({ match }: { match: MatchWForms }) => {
	const rawBlueErrors: { name: string; value: number }[] = [];
	const rawRedErrors: { name: string; value: number }[] = [];

	// Our data
	const { blue, red } = aggregatePiecesScored(match);
	// TBA data, guaranteed to have official prop if this component is rendered
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { blue: tbaBlue, red: tbaRed } = match.official!;
	console.log(match.matchNumber, { blue, red });
	console.log(match.matchNumber, { tbaBlue, tbaRed });

	// ============= Blue Validations =============
	rawBlueErrors.push({ name: 'Blue Cubes High', value: blue.highCubes - tbaBlue.highCubes });
	rawBlueErrors.push({ name: 'Blue Cones High', value: blue.highCones - tbaBlue.highCones });

	rawBlueErrors.push({ name: 'Blue Cubes Mid', value: blue.midCubes - tbaBlue.midCubes });
	rawBlueErrors.push({ name: 'Blue Cones Mid', value: blue.midCones - tbaBlue.midCones });

	rawBlueErrors.push({ name: 'Blue Cubes Low', value: blue.lowCubes - tbaBlue.lowCubes });
	rawBlueErrors.push({ name: 'Blue Cones Low', value: blue.lowCones - tbaBlue.lowCones });

	// ============= Red Validations =============
	rawRedErrors.push({ name: 'Red Cubes High', value: red.highCubes - tbaRed.highCubes });
	rawRedErrors.push({ name: 'Red Cones High', value: red.highCones - tbaRed.highCones });

	rawRedErrors.push({ name: 'Red Cubes Mid', value: red.midCubes - tbaRed.midCubes });
	rawRedErrors.push({ name: 'Red Cones Mid', value: red.midCones - tbaRed.midCones });

	rawRedErrors.push({ name: 'Red Cubes Low', value: red.lowCubes - tbaRed.lowCubes });
	rawRedErrors.push({ name: 'Red Cones Low', value: red.lowCones - tbaRed.lowCones });

	const blueErrors = rawBlueErrors.filter((err) => err.value !== 0);
	const redErrors = rawRedErrors.filter((err) => err.value !== 0);

	if (redErrors.length === 0 && blueErrors.length === 0) return null;

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
							blueErrors.map(({ name, value }, i) => (
								<Text key={i}>
									{name} {value < 0 ? 'low by' : 'high by'} {value}
								</Text>
							))
						)}
					</Stack>
				</Paper>
				<Paper bg='red' p='xs' withBorder>
					<Stack>
						<Title order={2}>Red</Title>
						{redErrors.length === 0 ? (
							<Text>No Errors 😁</Text>
						) : (
							blueErrors.map(({ name, value }, i) => (
								<Text key={i}>
									{name} {value < 0 ? 'low by' : 'high by'} {value}
								</Text>
							))
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
