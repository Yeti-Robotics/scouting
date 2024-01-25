import { useUser } from '@/lib/useUser';
import { Burger, Drawer, Group, Paper, Stack, Title, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { Link } from '../../Link';
import { ThemeSwitch } from '../ThemeSwitch';
import { ColorPicker } from '../ColorPicker';
import NavBarButtons from './NavBarButtons';
import Image from 'next/image';

const NavBar = () => {
	const { user } = useUser({ canRedirect: false });
	const [menuOpened, setMenuOpened] = useState(false);
	const theme = useMantineTheme();

	return (
		<Paper
			radius={0}
			bg={theme.colorScheme === 'light' ? theme.white : '#1A1B1E'}
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				display: 'flex',
				justifyContent: 'space-between',
				width: '100%',
				alignItems: 'center',
				opacity: 1,
				padding: '0.5rem 1rem 0.5rem 1rem',
				height: 48,
				zIndex: 100,
				borderBottom: `1px solid ${
					theme.colorScheme === 'light' ? '#1A1B1E11' : '#FFFFFF11'
				}`,
			}}
		>
			<Link
				sx={{
					'&:visited': { color: 'inherit' },
					textDecoration: 'none',
					display: 'flex',
					alignItems: 'center',
				}}
				href='/'
			>
				<Image src='/yeti-logo.png' alt='Yeti Roboics Logo' height={35} width={35} />
				<Title order={3} ml={8} color={theme.colorScheme === 'light' ? 'black' : 'white'}>
					YETI Scouting
				</Title>
			</Link>
			<Burger opened={menuOpened} onClick={() => setMenuOpened((prev) => !prev)} />
			<Drawer
				opened={menuOpened}
				position='top'
				onClose={() => setMenuOpened(false)}
				withCloseButton={false}
				padding={0}
			>
				<Group position='apart' p='md'>
					<Group>
						<ThemeSwitch /> <ColorPicker />
					</Group>
					<Burger opened={menuOpened} onClick={() => setMenuOpened((prev) => !prev)} />
				</Group>
				<Stack spacing={0}>
					<NavBarButtons isLoggedIn={user !== undefined} setMenuOpened={setMenuOpened} />
				</Stack>
			</Drawer>
		</Paper>
	);
};

export default NavBar;
