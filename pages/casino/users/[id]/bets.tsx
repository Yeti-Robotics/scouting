import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { Bet } from '@/models/Match';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const BetDisplay: React.VFC<{ bet: Bet & { matchNumber: number; setNumber: number } }> = ({
	bet,
}) => {
	return (
		<Box
			sx={{
				margin: 1,
				padding: 1,
				backgroundColor: 'primary.main',
				borderRadius: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				flexGrow: 1,
			}}
		>
			<h2 style={{ marginBottom: 0 }}>Match #: {bet.matchNumber}</h2>
			<h3 style={{ marginTop: 0 }}>Set #: {bet.setNumber}</h3>
			<Box sx={{ margin: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
				{bet.winner && (
					<Box
						sx={{
							padding: 1,
							margin: 1,
							backgroundColor: 'primary.dark',
							borderRadius: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Winner</h4>
						<h5 style={{ margin: 0 }}>Bet: {bet.winner.bet}</h5>
						<h5 style={{ margin: 0 }}>Amount: {bet.winner.amount}</h5>
					</Box>
				)}
				{bet.topScorer && (
					<Box
						sx={{
							padding: 1,
							margin: 1,
							backgroundColor: 'primary.dark',
							borderRadius: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Top Scorer</h4>
						<h5 style={{ margin: 0 }}>Bet: {bet.topScorer.bet}</h5>
						<h5 style={{ margin: 0 }}>Amount: {bet.topScorer.amount}</h5>
					</Box>
				)}
				{bet.bottomScorer && (
					<Box
						sx={{
							padding: 1,
							margin: 1,
							backgroundColor: 'primary.dark',
							borderRadius: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Bottom Scorer</h4>
						<h5 style={{ margin: 0 }}>Bet: {bet.bottomScorer.bet}</h5>
						<h5 style={{ margin: 0 }}>Amount: {bet.bottomScorer.amount}</h5>
					</Box>
				)}
			</Box>
		</Box>
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

	if (!user || !data) return <LoadingLayout />;

	if (user.banned)
		return (
			<Layout>
				<h1>You&#39;re banned you sussy baka.</h1>
			</Layout>
		);

	return (
		<Layout>
			<h1 style={{ marginBottom: 0 }}>{data.username}&#39;s bets</h1>
			<h2 style={{ color: 'rgb(150, 150, 50)', marginTop: 0 }}>Their coins: {data.coins}</h2>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
				}}
			>
				{data.bets && data.bets[0] ? (
					data.bets.map((bet) => <BetDisplay bet={bet} key={bet._id} />)
				) : (
					<h1>No bets for this user</h1>
				)}
			</Box>
		</Layout>
	);
};

export default UserBets;
