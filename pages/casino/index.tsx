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
		<Button href={href} component={Link} leftIcon={Icon}>
			{text}
		</Button>
	);
};

const Casino = () => {
	const { user } = useUser({ canRedirect: true });

	if (!user) return <Loader size='xl' />;

	return (
		<>
			<h1>Casino</h1>
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
