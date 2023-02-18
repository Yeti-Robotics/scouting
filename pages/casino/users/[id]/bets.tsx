import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { Bet } from '@/models/Match';
import { Box, Group, Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const BetDisplay = ({ bet }: { bet: Bet & { matchNumber: number; setNumber: number } }) => {
	return (
		<Stack align='center' justify='center'>
			<h2 style={{ marginBottom: 0 }}>Match #: {bet.matchNumber}</h2>
			<h3 style={{ marginTop: 0 }}>Set #: {bet.setNumber}</h3>
			<Box sx={{ margin: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
				{bet.winner && (
					<Stack align='center' justify='center'>
						<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Winner</h4>
						<h5 style={{ margin: 0 }}>Bet: {bet.winner.bet}</h5>
						<h5 style={{ margin: 0 }}>Amount: {bet.winner.amount}</h5>
					</Stack>
				)}
				{bet.topScorer && (
					<Stack align='center' justify='center'>
						<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Top Scorer</h4>
						<h5 style={{ margin: 0 }}>Bet: {bet.topScorer.bet}</h5>
						<h5 style={{ margin: 0 }}>Amount: {bet.topScorer.amount}</h5>
					</Stack>
				)}
				{bet.bottomScorer && (
					<Stack align='center' justify='center'>
						<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Bottom Scorer</h4>
						<h5 style={{ margin: 0 }}>Bet: {bet.bottomScorer.bet}</h5>
						<h5 style={{ margin: 0 }}>Amount: {bet.bottomScorer.amount}</h5>
					</Stack>
				)}
			</Box>
		</Stack>
	);
};

const UserBets = () => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<{
		bets: (Bet & { matchNumber: number; setNumber: number })[];
		coins: number;
		username: string;
	}>(router.isReady ? `/api/auth/users/${router.query.id}/bets` : null, fetcher);

	if (!user || !data) return <Loader size='xl' />;

	if (user.banned) return <h1>You&#39;re banned you sussy baka.</h1>;

	return (
		<>
			<h1 style={{ marginBottom: 0 }}>{data.username}&#39;s bets</h1>
			<h2 style={{ color: 'rgb(150, 150, 50)', marginTop: 0 }}>Their coins: {data.coins}</h2>
			<Group align='center'>
				{data.bets && data.bets[0] ? (
					data.bets.map((bet) => <BetDisplay bet={bet} key={bet._id} />)
				) : (
					<h1>No bets for this user</h1>
				)}
			</Group>
		</>
	);
};

export default UserBets;
