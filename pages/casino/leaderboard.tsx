import { Link } from '@/components/Link';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { UserI } from '@/models/User';
import { Box, Divider, Anchor, Loader, Text, Title } from '@mantine/core';
import useSWR from 'swr';

const UserBets = () => {
	const { user } = useUser({ canRedirect: true });
	const { data } = useSWR<UserI[]>('/api/leaderboard', fetcher);

	if (!user || !data) return <Loader size='xl' />;

	if (user.banned) return <h1>You&#39;re banned you sussy baka.</h1>;

	return (
		<>
			<h1 style={{ marginBottom: 0 }}>Leaderboard</h1>
			<Box
				sx={{
					textDecoration: 'none',
					width: '100%',
					pt: 2,
					pb: 2,
					display: 'flex',
					justifyContent: 'space-around',
				}}
			>
				<Title size={24}>Username</Title>
				<Title size={24}>Coinage</Title>
			</Box>
			<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
				<Divider />
				{data.map((user) => (
					<>
						<Link
							p='md'
							sx={{
								textDecoration: 'none',
								width: '100%',
								pt: 2,
								pb: 2,
								display: 'flex',
								justifyContent: 'space-around',
							}}
							href={`/casino/users/${user._id}/bets`}
							passHref
						>
							<Anchor component='div'>{user.username}</Anchor>
							<Box sx={{ color: 'rgb(150, 150, 50)' }}>Coinage: {user.coins}</Box>
						</Link>
						<Divider />
					</>
				))}
			</Box>
		</>
	);
};

export default UserBets;
