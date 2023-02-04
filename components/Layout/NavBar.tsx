import { useUser } from '@/lib/useUser';
import {
	IconUserCircle,
	IconCalendar,
	IconCopy,
	IconFile,
	IconMenu,
	IconNote,
	IconMoneybag,
	IconShirtSport,
} from '@tabler/icons-react';
import { Box, Button, Divider, Drawer, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from '../Link';

interface ButtonProps {
	href: string;
	text: string;
	Icon?: JSX.Element;
}

const NavBarButton = ({ href, text, Icon }: ButtonProps) => {
	return (
		<Link href={href} p='md' h={75}>
			<Group align='center'>
				{Icon}
				{text}
			</Group>
		</Link>
	);
};

const getRandomColorValue = () => Math.ceil(Math.random() * 255);

const CasinoButton = () => {
	const [colorValue, setColorValue] = useState({
		r: getRandomColorValue(),
		g: getRandomColorValue(),
		b: getRandomColorValue(),
	});
	const avgColorDark = (colorValue.r + colorValue.g + colorValue.b) / 3 <= 127.5;

	useEffect(() => {
		const interval = setInterval(
			() =>
				setColorValue({
					r: getRandomColorValue(),
					g: getRandomColorValue(),
					b: getRandomColorValue(),
				}),
			300,
		);
		return () => clearInterval(interval);
	}, []);

	return (
		<Link
			href='/casino'
			p='md'
			h={75}
			sx={{
				backgroundColor: `rgb(${colorValue.r}, ${colorValue.g}, ${colorValue.b})`,
				color: avgColorDark ? 'white' : 'black',
			}}
		>
			<Group align='center'>
				<IconMoneybag style={{ margin: 1, color: avgColorDark ? 'white' : 'black' }} />
				Casino
			</Group>
		</Link>
	);
};

const NavBar = () => {
	const { user } = useUser({ redirectIfNotFound: false, redirectOnError: false });
	const [menuOpened, setMenuOpened] = useState(false);

	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
				alignItems: 'center',
				opacity: 1,
				padding: '0.5rem 2rem 0.5rem 2rem',
			}}
		>
			<Link href='/'>
				<h1 style={{ flexGrow: 1, textDecoration: 'underline', cursor: 'pointer' }}>
					Yeti Scouting
				</h1>
			</Link>
			<Button
				variant='outlined'
				sx={{ color: 'text.primary', borderColor: 'text.primary', padding: '1rem' }}
				onClick={() => setMenuOpened((prev) => !prev)}
			>
				<IconMenu />
			</Button>
			<Drawer opened={menuOpened} position='top' onClose={() => setMenuOpened(false)}>
				<NavBarButton
					href={user ? '/logout' : '/login'}
					text={user ? 'Logout' : 'Login'}
					Icon={<IconUserCircle style={{ margin: 8 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/stand-scouting'
					text='Stand Scouting Form'
					Icon={<IconNote style={{ margin: 8 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/pit-scouting'
					text='Pit Scouting Form'
					Icon={<IconNote style={{ margin: 8 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/matches'
					text='Match Data'
					Icon={<IconShirtSport style={{ margin: 8 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/scouting-schedule'
					text='Stand Scouting Schedule'
					Icon={<IconCalendar style={{ margin: 8 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/records'
					text='Records'
					Icon={<IconFile style={{ margin: 8 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/export'
					text='Export Data'
					Icon={<IconCopy style={{ margin: 8 }} />}
				/>
				<Divider />
				<CasinoButton />
			</Drawer>
		</Box>
	);
};

export default NavBar;
