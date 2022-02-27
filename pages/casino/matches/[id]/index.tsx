import BetsForm from '@/components/Casino/BetsForm';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const userHasBetOn = (match: MatchI, user: UserI) =>
	match.bets.map((bet) => bet.username).includes(user.username);

const TeamWrapper: React.VFC<{ teamNumber: number; col: 'red' | 'blue' }> = ({
	teamNumber,
	col,
}) => {
	return (
		<Link href={`/teams/${teamNumber}`} passHref>
			<Button
				component='a'
				target='_blank'
				rel='noopener noreferrer'
				sx={{
					padding: 1,
					margin: 1,
					borderRadius: 1,
					backgroundColor: col,
					color: 'white',
					textTransform: 'none',
				}}
			>
				{teamNumber}
			</Button>
		</Link>
	);
};

const Match = () => {
	const router = useRouter();
	const { user } = useUser({ canRedirect: true });
	const { data, error } = useSWR<MatchI>(
		router.isReady ? `/api/matches/${router.query.id}` : null,
		fetcher,
	);

	if (!data || !user) return <LoadingLayout />;

	const betsClosed = data.startTime < Date.now() + 300000;

	if (error) {
		return (
			<Layout>
				<h1>There was an error retrieving this form.</h1>
			</Layout>
		);
	}

	if (!data._id) {
		return (
			<Layout>
				<h1>No form was found with this id.</h1>
			</Layout>
		);
	}

	return (
		<Layout>
			{user.administrator && (
				<Link href={`/casino/matches/${router.query.id}/edit`} passHref>
					<Button component='a' variant='contained'>
						Edit Match
					</Button>
				</Link>
			)}
			<h1 style={{ marginBottom: 0 }}>Match Number: {data.matchNumber}</h1>
			<h2 style={{ marginTop: 0 }}>Set Number: {data.setNumber}</h2>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Box
					sx={{
						backgroundColor: 'rgb(100, 100, 255)',
						color: 'white',
						fontWeight: 'bold',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 1,
						margin: 1,
						flexGrow: 1,
					}}
				>
					<h2>Blue Alliance</h2>
					<Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
						{data.blue1 && <TeamWrapper teamNumber={data.blue1} col='blue' />}
						{data.blue2 && <TeamWrapper teamNumber={data.blue2} col='blue' />}
						{data.blue3 && <TeamWrapper teamNumber={data.blue3} col='blue' />}
					</Box>
				</Box>
				<Box
					sx={{
						backgroundColor: 'rgb(255, 100, 100)',
						color: 'white',
						fontWeight: 'bold',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 1,
						margin: 1,
						flexGrow: 1,
					}}
				>
					<h2>Red Alliance</h2>
					<Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
						{data.red1 && <TeamWrapper teamNumber={data.red1} col='red' />}
						{data.red2 && <TeamWrapper teamNumber={data.red2} col='red' />}
						{data.red3 && <TeamWrapper teamNumber={data.red3} col='red' />}
					</Box>
				</Box>
			</Box>
			<p style={{ fontSize: 14 }}>
				Click the team numbers above to see team data and inform your bets.
			</p>
			{
				/*!betsClosed && */ !userHasBetOn(data, user) && (
					<BetsForm match={data} user={user} id={String(router.query.id)} />
				)
			}
		</Layout>
	);
};

export default Match;
