import { useUser } from '@/lib/useUser';
import { AccountCircle, Menu, NoteAdd } from '@mui/icons-material';
import { Box, Button, Divider, Drawer } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

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
					Scouting
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
				<Link href={user ? '/logout' : '/login'} passHref={true}>
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
						<AccountCircle sx={{ margin: 1 }} />
						{user ? 'Logout' : 'Login'}
					</Box>
				</Link>
				<Divider />
				<Link href='/stand-scouting' passHref={true}>
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
						<NoteAdd sx={{ margin: 1 }} />
						Stand Scouting
					</Box>
				</Link>
				<Divider />
				<Link href='/pit-scouting' passHref={true}>
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
						<NoteAdd sx={{ margin: 1 }} />
						Pit Scouting
					</Box>
				</Link>
			</Drawer>
		</Box>
	);
};

export default NavBar;
