import { useUser } from '@/lib/useUser';
import { AccountCircle, InsertDriveFile, Menu, NoteAdd } from '@mui/icons-material';
import { Box, Button, Divider, Drawer } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

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
					text='Stand Scouting'
					Icon={<NoteAdd sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/pit-scouting'
					text='Pit Scouting'
					Icon={<NoteAdd sx={{ margin: 1 }} />}
				/>
				<Divider />
				<NavBarButton
					href='/records'
					text='Records'
					Icon={<InsertDriveFile sx={{ margin: 1 }} />}
				/>
			</Drawer>
		</Box>
	);
};

export default NavBar;
