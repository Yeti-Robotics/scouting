import { useUser } from '@/lib/useUser';
import { Burger, Drawer, Group, Paper, Stack, Title, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { Link } from '../../Link';
import { ThemeSwitch } from '../ThemeSwitch';
import { ColorPicker } from '../ColorPicker';
import NavBarButtons from './NavBarButtons';

const NavBar = () => {
	const { user } = useUser({ canRedirect: false });
	const [menuOpened, setMenuOpened] = useState(false);
	const theme = useMantineTheme();

	return (
		<Paper
			radius={0}
			bg={theme.primaryColor}
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
			}}
		>
			<Link
				sx={{
					'&:visited': { color: 'inherit' },
					textDecoration: 'none',
				}}
				href='/'
			>
				<Title
					sx={(theme) => ({
						fontSize: '1.5rem',
						color: theme.colorScheme === 'light' ? 'black' : 'white',
					})}
				>
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
