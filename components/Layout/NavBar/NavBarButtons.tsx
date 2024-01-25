import NavBarButton, { ButtonProps } from './NavBarButton';
import {
	IconUserCircle,
	IconCalendar,
	IconFile,
	IconNote,
	IconShirtSport,
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
			setMenuOpened: setMenuOpened,
		},
		{
			href: '/stand-scouting',
			text: 'Stand Scouting Form',
			Icon: <IconNote style={{ margin: 8 }} />,
			setMenuOpened: setMenuOpened,
		},
		{
			href: '/pit-scouting',
			text: 'Pit Scouting Form',
			Icon: <IconNote style={{ margin: 8 }} />,
			setMenuOpened: setMenuOpened,
		},
		{
			href: '/teams',
			text: 'Team Data',
			Icon: <IconShirtSport style={{ margin: 8 }} />,
			setMenuOpened: setMenuOpened,
		},
		{
			href: '/scouting-schedule',
			text: 'Stand Scouting Schedule',
			Icon: <IconCalendar style={{ margin: 8 }} />,
			setMenuOpened: setMenuOpened,
		},
		{
			href: '/records',
			text: 'Records',
			Icon: <IconFile style={{ margin: 8 }} />,
			setMenuOpened: setMenuOpened,
		},
		{
			href: '/matches',
			text: 'Records',
			Icon: <IconShirtSport style={{ margin: 8 }} />,
			setMenuOpened: setMenuOpened,
		},
	];

	return (
		<>
			{navButtons.map((navButtonData) => (
				<NavBarButton key={navButtonData.text} {...navButtonData} />
			))}
		</>
	);
}
