import { useUser } from '@/lib/useUser';
import {
	AccountCircle,
	CalendarToday,
	FileCopy,
	InsertDriveFile,
	Menu,
	NoteAdd,
	Paid,
	SportsKabaddi,
} from '@mui/icons-material';
import { Box, Button, Divider, Drawer } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ButtonProps {
	href: string;
	text: string;
	Icon?: JSX.Element;
}

const NavBarButton: React.VFC<ButtonProps> = ({ href, text, Icon }) => {
	return (
		<Link href={href} passHref={true}>
			<Box
				component='a'
				sx={{
					display: 'flex',
					alignItems: 'center',
					height: 75,
					padding: 2,
					'&:hover': { backgroundColor: 'primary.light' },
				}}
			>
				{Icon}
				{text}
			</Box>
		</Link>
	);
};

const getRandomColorValue = () => Math.ceil(Math.random() * 255);

const CasinoButton: React.VFC = () => {
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
		<Link href='/casino' passHref={true}>
			<Box
				component='a'
				sx={{
					display: 'flex',
					alignItems: 'center',
					height: 75,
					padding: 2,
					backgroundColor: `rgb(${colorValue.r}, ${colorValue.g}, ${colorValue.b})`,
					color: avgColorDark ? 'white' : 'black',
				}}
			>
				<Paid sx={{ margin: 1, color: avgColorDark ? 'white' : 'black' }} />
				Casino
			</Box>
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
				backgroundColor: 'primary.main',
				width: '100%',
				alignItems: 'center',
				opacity: 1,
				padding: '0.5rem 2rem 0.5rem 2rem',
			}}
		>
			<Link href='/' passHref={true}>
				<h1 style={{ flexGrow: 1, textDecoration: 'underline', cursor: 'pointer' }}>
					Yeti Scouting
				</h1>
			</Link>
			<Button
				variant='outlined'
				sx={{ color: 'text.primary', borderColor: 'text.primary', padding: '1rem' }}
				onClick={() => setMenuOpened((prev) => !prev)}
			>
				<Menu />
			</Button>
			<Drawer open={menuOpened} anchor='top' onClose={() => setMenuOpened(false)}>
				<NavBarButton
					href={user ? '/logout' : '/login'}
					text={user ? 'Logout' : 'Login'}
					Icon={<AccountCircle sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/stand-scouting'
					text='Stand Scouting Form'
					Icon={<NoteAdd sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/pit-scouting'
					text='Pit Scouting Form'
					Icon={<NoteAdd sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/matches'
					text='Match Data'
					Icon={<SportsKabaddi sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/scouting-schedule'
					text='Stand Scouting Schedule'
					Icon={<CalendarToday sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/records'
					text='Records'
					Icon={<InsertDriveFile sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/export'
					text='Export Data'
					Icon={<FileCopy sx={{ margin: 1 }} />}
				/>
				<Divider />
				<CasinoButton />
			</Drawer>
		</Box>
	);
};

export default NavBar;
