import FlexGrid from '@/components/FlexGrid';
import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import { useUser } from '@/lib/useUser';
import { Paid, ShowChart, SportsKabaddi } from '@mui/icons-material';
import { Button } from '@mui/material';
import Link from 'next/link';

interface MenuCardProps {
	href: string;
	text: string;
	Icon?: JSX.Element;
}

const MenuCard: React.VFC<MenuCardProps> = ({ href, text, Icon }) => {
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
			>
				{Icon} {text}
			</Button>
		</Link>
	);
};

const Casino = () => {
	const { user } = useUser({ canRedirect: true });

	if (!user) return <LoadingLayout />;

	return (
		<Layout>
			<h1>Records</h1>
			<FlexGrid>
				<MenuCard
					href='/casino/matches'
					text='Matches'
					Icon={<SportsKabaddi sx={{ mr: 1 }} />}
				/>
				<MenuCard
					href='/casino/leaderboard'
					text='Leaderboard'
					Icon={<ShowChart sx={{ mr: 1 }} />}
				/>
				<MenuCard
					href={`/casino/users/${user._id}/bets`}
					text='My Bets'
					Icon={<Paid sx={{ mr: 1 }} />}
				/>
			</FlexGrid>
		</Layout>
	);
};

export default Casino;
