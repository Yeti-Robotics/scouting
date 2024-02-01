import fetcher from '@/lib/fetch';
import { aggregatePiecesScored } from '@/lib/matchDataUtils';
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

	// ============= Blue Validations =============
	rawBlueErrors.push({ name: 'Blue Amp Notes', value: blue.ampNotes - tbaBlue.highCubes });
	rawBlueErrors.push({
		name: 'Blue Speaker Notes',
		value: blue.speakerNotes - tbaBlue.highCones,
	});

	// ============= Red Validations =============
	rawBlueErrors.push({ name: 'Red Amp Notes', value: red.ampNotes - tbaRed.highCubes });
	rawBlueErrors.push({
		name: 'red Speaker Notes',
		value: red.speakerNotes - tbaRed.highCones,
	});

	const blueErrors = rawBlueErrors.filter((err) => err.value !== 0);
	const redErrors = rawRedErrors.filter((err) => err.value !== 0);

	if (redErrors.length === 0 && blueErrors.length === 0) return null;

	return (
		<Card withBorder shadow='xl'>
			<Title align='center'>Match {match.matchNumber}</Title>
			<Group align='flex' position='center'>
				<Paper bg='red' p='xs' withBorder sx={{ color: 'white' }}>
					<Stack>
						<Title order={2}>Red</Title>
						{redErrors.length === 0 ? (
							<Text>No Errors 😁</Text>
						) : (
							redErrors.map(({ name, value }, i) => (
								<Text key={i}>
									{name} {value < 0 ? 'low by' : 'high by'} {Math.abs(value)}
								</Text>
							))
						)}
					</Stack>
				</Paper>
				<Paper bg='blue' p='xs' withBorder sx={{ color: 'white' }}>
					<Stack>
						<Title order={2}>Blue</Title>
						{blueErrors.length === 0 ? (
							<Text>No Errors 😁</Text>
						) : (
							blueErrors.map(({ name, value }, i) => (
								<Text key={i}>
									{name} {value < 0 ? 'low by' : 'high by'} {Math.abs(value)}
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
