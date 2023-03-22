import { Link } from '@/components/Link';
import fetcher from '@/lib/fetch';
import { hasTeam } from '@/lib/matchDataUtils';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Button, Card, Group, Loader, NumberInput, Paper, Stack, Text, Title } from '@mantine/core';
import { memo, useState } from 'react';
import useSWR from 'swr';

const MatchDisplay = memo(function MatchDisplay({ user, match }: { match: MatchI; user?: UserI }) {
	return (
		<Card component={Link} href={`/matches/${match.matchNumber}`} withBorder shadow='md'>
			<Stack align='center'>
				<Title order={2}>Match {match.matchNumber}</Title>
				<Group>
					<Paper bg='blue' p='xs' withBorder>
						<Text weight={600}>
							Blue 1:
							<br /> {match.blue1}
						</Text>
						<Text weight={600}>
							Blue 2:
							<br /> {match.blue2}
						</Text>
						<Text weight={600}>
							Blue 3:
							<br /> {match.blue3}
						</Text>
					</Paper>
					<Paper bg='red' p='xs' withBorder>
						<Text weight={600}>
							Red 1:
							<br /> {match.red1}
						</Text>
						<Text weight={600}>
							Red 2:
							<br /> {match.red2}
						</Text>
						<Text weight={600}>
							Red 3:
							<br /> {match.red3}
						</Text>
					</Paper>
				</Group>
			</Stack>
		</Card>
	);
});

const MatchData = () => {
	const { data } = useSWR<MatchI[]>('/api/matches', fetcher);
	const { user } = useUser({ canRedirect: true });
	const [matchNum, setMatchNum] = useState<number | ''>('');
	const [teamNum, setTeamNum] = useState<number | ''>('');

	const clearFilters = () => {
		setMatchNum('');
		setTeamNum('');
	};

	if (!data || !user) return <Loader size='xl' />;

	if (user.banned) return <h1>You&#39;ve been banned you sussy baka.</h1>;

	return (
		<>
			<h1>Match Data</h1>
			<Title order={2}>Filters</Title>
			<Group position='center'>
				<NumberInput value={matchNum} label='Match Number' onChange={setMatchNum} />
				<NumberInput value={teamNum} label='Team Number' onChange={setTeamNum} />
			</Group>
			<Button onClick={clearFilters}>Clear Filters</Button>
			<Group align='center' position='center'>
				{data
					.filter(
						matchNum === '' ? () => true : (match) => match.matchNumber === matchNum,
					)
					.filter(teamNum === '' ? () => true : (match) => hasTeam(match, teamNum))
					.map((match) => (
						<MatchDisplay key={match._id} match={match} user={user} />
					))}
			</Group>
		</>
	);
};

export default MatchData;
