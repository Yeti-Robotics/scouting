import BetsForm from '@/components/Casino/BetsForm';
import { Link } from '@/components/Link';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Button, Card, Group, Loader, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const userHasBetOn = (match: MatchI, user: UserI) =>
	match.bets.map((bet) => bet.username).includes(user.username);

const TeamWrapper = ({ teamNumber, col }: { teamNumber: number; col: 'red' | 'blue' }) => {
	return (
		<Button component={Link} href={`/teams/${teamNumber}`} color={col}>
			{teamNumber}
		</Button>
	);
};

const Match = () => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: true });
	const { data, error } = useSWR<MatchI>(
		router.isReady ? `/api/matches/${router.query.id}` : null,
		fetcher,
	);

	if (!data || !user) return <Loader size='xl' />;

	const betsClosed = data.startTime < Date.now() + 300000;

	if (error) {
		return <h1>There was an error retrieving this form.</h1>;
	}

	if (!data._id) {
		return <h1>No form was found with this id.</h1>;
	}

	return (
		<>
			{user.administrator && (
				<Button component={Link} href={`/casino/matches/${router.query.id}/edit`}>
					Edit Match
				</Button>
			)}
			<Title order={1}>Match Number: {data.matchNumber}</Title>
			<Title order={2}>Set Number: {data.setNumber}</Title>
			<Group align='center'>
				<Card withBorder shadow='xl' bg='blue.5' p='md'>
					<Title order={2} color='white'>
						Blue Alliance
					</Title>
					<Stack spacing='xs'>
						{data.blue1 && <TeamWrapper teamNumber={data.blue1} col='blue' />}
						{data.blue2 && <TeamWrapper teamNumber={data.blue2} col='blue' />}
						{data.blue3 && <TeamWrapper teamNumber={data.blue3} col='blue' />}
					</Stack>
				</Card>
				<Card withBorder shadow='xl' bg='red.5' p='md'>
					<Title order={2} color='white'>
						Red Alliance
					</Title>
					<Stack spacing='xs'>
						{data.red1 && <TeamWrapper teamNumber={data.red1} col='red' />}
						{data.red2 && <TeamWrapper teamNumber={data.red2} col='red' />}
						{data.red3 && <TeamWrapper teamNumber={data.red3} col='red' />}
					</Stack>
				</Card>
			</Group>
			<p style={{ fontSize: 14 }}>
				Click the team numbers above to see team data and inform your bets.
			</p>
			{
				/*!betsClosed && */ !userHasBetOn(data, user) && (
					<BetsForm match={data} user={user} id={String(router.query.id)} />
				)
			}
		</>
	);
};

export default Match;
