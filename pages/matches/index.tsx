import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import useSWR from 'swr';

const Divider = () => <span style={{ backgroundColor: 'white', padding: '1px 0' }} />;

const MatchDisplay: React.VFC<{ match: MatchI; user?: UserI }> = ({ user, match }) => {
	return (
		<Link href={`/matches/${match.matchNumber}`} passHref>
			<Button
				component='a'
				variant='contained'
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					'&.MuiButton-contained': {
						color: 'white',
					},
					textTransform: 'none',
					flexGrow: 1,
					padding: 1,
					margin: 1,
				}}
			>
				<h2 style={{ margin: 0 }}>Match: {match.matchNumber}</h2>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 500,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							backgroundColor: 'blue',
							padding: 1,
							margin: 1,
							borderRadius: '4px',
						}}
					>
						<Box>
							Blue 1:
							<br /> {match.blue1}
						</Box>
						<Divider />
						<Box>
							Blue 2:
							<br /> {match.blue2}
						</Box>
						<Divider />
						<Box>
							Blue 3:
							<br /> {match.blue3}
						</Box>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							backgroundColor: 'red',
							padding: 1,
							margin: 1,
							borderRadius: '4px',
						}}
					>
						<Box>
							Red 1:
							<br /> {match.red1}
						</Box>
						<Divider />
						<Box>
							Red 2:
							<br /> {match.red2}
						</Box>
						<Divider />
						<Box>
							Red 3:
							<br /> {match.red3}
						</Box>
					</Box>
				</Box>
				{user?.administrator && (
					<Link href={`/matches/${match.matchNumber}/edit`} passHref>
						<Button
							onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
							component='a'
							variant='contained'
						>
							Edit Match
						</Button>
					</Link>
				)}
			</Button>
		</Link>
	);
};

const MatchData = () => {
	const { data } = useSWR<MatchI[]>('/api/matches', fetcher);
	const { user } = useUser({ canRedirect: true });

	if (!data || !user) return <LoadingLayout />;

	if (user.banned)
		return (
			<Layout>
				<h1>You&#39;ve been banned you sussy baka.</h1>
			</Layout>
		);

	return (
		<Layout>
			<h1>Match Data</h1>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
				{data.map((match) => (
					<MatchDisplay key={match._id} match={match} user={user} />
				))}
			</Box>
		</Layout>
	);
};

export default MatchData;
