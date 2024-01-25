import NavBarButton, { ButtonProps } from './NavBarButton';
import {
	IconUserCircle,
	IconCalendar,
	IconFile,
	IconNote,
	IconShirtSport,
	Icon123,
} from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';

interface NavBarButtonProps {
	isLoggedIn: boolean;
	setMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function NavBarButtons({ setMenuOpened, isLoggedIn }: NavBarButtonProps) {
	const navButtons: ButtonProps[] = [
		{
			href: isLoggedIn ? '/logout' : '/login',
			text: isLoggedIn ? 'Logout' : 'Login',
			Icon: <IconUserCircle style={{ margin: 8 }} />,
			setMenuOpened,
		},
		{
			href: '/stand-scouting',
			text: 'Stand Scouting Form',
			Icon: <IconNote style={{ margin: 8 }} />,
			setMenuOpened,
		},
		{
			href: '/pit-scouting',
			text: 'Pit Scouting Form',
			Icon: <IconNote style={{ margin: 8 }} />,
			setMenuOpened,
		},
		{
			href: '/teams',
			text: 'Team Data',
			Icon: <IconShirtSport style={{ margin: 8 }} />,
			setMenuOpened,
		},
		{
			href: '/scouting-schedule',
			text: 'Stand Scouting Schedule',
			Icon: <IconCalendar style={{ margin: 8 }} />,
			setMenuOpened,
		},
		{
			href: '/records',
			text: 'Records',
			Icon: <IconFile style={{ margin: 8 }} />,
			setMenuOpened,
		},
		{
			href: '/matches',
			text: 'Match Data',
			Icon: <IconShirtSport style={{ margin: 8 }} />,
			setMenuOpened,
		},
	];
	isLoggedIn &&
		navButtons.push({
			href: '/scout-error-ranking',
			text: 'Scout Ranking',
			Icon: <Icon123 style={{ margin: 8 }} />,
			setMenuOpened,
		});

	return (
		<>
			{navButtons.map((navButtonData) => (
				<NavBarButton key={navButtonData.text} {...navButtonData} />
			))}
		</>
	);
}
