import { Link } from '@/components/Link';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Box, Divider, Anchor, Loader } from '@mantine/core';
import useSWR from 'swr';

const UserBets = () => {
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<UserI[]>('/api/leaderboard', fetcher);

	if (!user || !data) return <Loader size='xl' />;

	if (user.banned) return <h1>You&#39;re banned you sussy baka.</h1>;

	return (
		<>
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
								<Anchor component='div'>{user.username}</Anchor>
								<Box sx={{ color: 'rgb(150, 150, 50)' }}>Coinage: {user.coins}</Box>
							</Box>
						</Link>
						<Divider />
					</>
				))}
			</Box>
		</>
	);
};

export default UserBets;
