import { useUser } from '@/lib/useUser';
import { IconCoin, IconLayoutBoard, IconSportBillard } from '@tabler/icons-react';
import { Button, Group, Loader } from '@mantine/core';
import { Link } from '@/components/Link';

interface MenuCardProps {
	href: string;
	text: string;
	Icon?: JSX.Element;
}

const MenuCard = ({ href, text, Icon }: MenuCardProps) => {
	return (
		<Link href={href} passHref>
			<Button
				component='a'
				sx={{
					color: 'text.primary',
					backgroundColor: 'primary.main',
					display: 'flex',
					alignItems: 'center',
					padding: 2,
					margin: 1,
					borderRadius: 1,
					textTransform: 'none',
				}}
				variant='contained'
				leftIcon={Icon}
			>
				{text}
			</Button>
		</Link>
	);
};

const Casino = () => {
	const { user } = useUser({ canRedirect: true });

	if (!user) return <Loader size='xl' />;

	return (
		<>
			<h1>Records</h1>
			<Group>
				<MenuCard href='/casino/matches' text='Matches' Icon={<IconSportBillard />} />
				<MenuCard
					href='/casino/leaderboard'
					text='Leaderboard'
					Icon={<IconLayoutBoard />}
				/>
				<MenuCard
					href={`/casino/users/${user._id}/bets`}
					text='My Bets'
					Icon={<IconCoin />}
				/>
			</Group>
		</>
	);
};

export default Casino;
