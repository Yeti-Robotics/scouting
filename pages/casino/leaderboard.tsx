import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Box, Divider, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import useSWR from 'swr';

const UserBets = () => {
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<UserI[]>('/api/leaderboard', fetcher);

	if (!user || !data) return <LoadingLayout />;

	if (user.banned)
		return (
			<Layout>
				<h1>You&#39;re banned you sussy baka.</h1>
			</Layout>
		);

	return (
		<Layout>
			<h1 style={{ marginBottom: 0 }}>Leaderboard</h1>
			<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
				<Divider />
				{data.map((user) => (
					<>
						<Link href={`/casino/users/${user._id}/bets`} passHref>
							<Box
								component='a'
								sx={{
									width: '100%',
									pt: 2,
									pb: 2,
									display: 'flex',
									justifyContent: 'space-around',
								}}
								key={user._id}
							>
								<MuiLink component='div'>{user.username}</MuiLink>
								<Box sx={{ color: 'rgb(150, 150, 50)' }}>Coinage: {user.coins}</Box>
							</Box>
						</Link>
						<Divider />
					</>
				))}
			</Box>
		</Layout>
	);
};

export default UserBets;
