import { useUser } from '@/lib/useUser';
import {
	IconUserCircle,
	IconCalendar,
	IconCopy,
	IconFile,
	IconNote,
	IconMoneybag,
	IconShirtSport,
	Icon123,
} from '@tabler/icons-react';
import {
	Burger,
	Drawer,
	Group,
	NavLink,
	Paper,
	Stack,
	Title,
	useMantineTheme,
} from '@mantine/core';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Link } from '../Link';
import { ThemeSwitch } from './ThemeSwitch';
import { ColorPicker } from './ColorPicker';

interface ButtonProps {
	href: string;
	text: string;
	Icon?: JSX.Element;
	setMenuOpened: Dispatch<SetStateAction<boolean>>;
}

const NavBarButton = ({ href, text, Icon, setMenuOpened }: ButtonProps) => {
	return (
		<NavLink
			label={text}
			icon={Icon}
			component={Link}
			href={href}
			p='md'
			onClick={() => setMenuOpened(false)}
		/>
	);
};

const getRandomColorValue = () => Math.ceil(Math.random() * 255);

const CasinoButton = ({ setMenuOpened }: { setMenuOpened: Dispatch<SetStateAction<boolean>> }) => {
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
		<NavLink
			component={Link}
			href='/casino'
			label='Casino'
			icon={<IconMoneybag style={{ color: avgColorDark ? 'white' : 'black' }} />}
			p='md'
			onClick={() => setMenuOpened(false)}
			sx={{
				backgroundColor: `rgb(${colorValue.r}, ${colorValue.g}, ${colorValue.b})`,
				'&:hover': {
					backgroundColor: `rgb(${colorValue.r}, ${colorValue.g}, ${colorValue.b})`,
				},
				color: avgColorDark ? 'white' : 'black',
			}}
		/>
	);
};

const NavBar = () => {
	const { user } = useUser({ canRedirect: false });
	const [menuOpened, setMenuOpened] = useState(false);
	const theme = useMantineTheme();

	return (
		<Paper
			shadow='xl'
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
						fontSize: 32,
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
					<NavBarButton
						href={user ? '/logout' : '/login'}
						text={user ? 'Logout' : 'Login'}
						Icon={<IconUserCircle style={{ margin: 8 }} />}
						setMenuOpened={setMenuOpened}
					/>
					{user && (
						<NavBarButton
							href='/stand-scouting'
							text='Stand Scouting Form'
							Icon={<IconNote style={{ margin: 8 }} />}
							setMenuOpened={setMenuOpened}
						/>
					)}
					{user && (
						<NavBarButton
							href='/pit-scouting'
							text='Pit Scouting Form'
							Icon={<IconNote style={{ margin: 8 }} />}
							setMenuOpened={setMenuOpened}
						/>
					)}
					{user && (
						<NavBarButton
							href='/scout-error-ranking'
							text='Scout Ranking'
							Icon={<Icon123 style={{ margin: 8 }} />}
							setMenuOpened={setMenuOpened}
						/>
					)}
					<NavBarButton
						href='/teams'
						text='Team Data'
						Icon={<IconShirtSport style={{ margin: 8 }} />}
						setMenuOpened={setMenuOpened}
					/>
					{user && (
						<NavBarButton
							href='/scouting-schedule'
							text='Stand Scouting Schedule'
							Icon={<IconCalendar style={{ margin: 8 }} />}
							setMenuOpened={setMenuOpened}
						/>
					)}
					<NavBarButton
						href='/records'
						text='Records'
						Icon={<IconFile style={{ margin: 8 }} />}
						setMenuOpened={setMenuOpened}
					/>
					<NavBarButton
						href='/matches'
						text='Match Data'
						Icon={<IconShirtSport style={{ margin: 8 }} />}
						setMenuOpened={setMenuOpened}
					/>
					<NavBarButton
						href='/export'
						text='Export Data'
						Icon={<IconCopy style={{ margin: 8 }} />}
						setMenuOpened={setMenuOpened}
					/>
					{user && <CasinoButton setMenuOpened={setMenuOpened} />}
				</Stack>
			</Drawer>
		</Paper>
	);
};

export default NavBar;
