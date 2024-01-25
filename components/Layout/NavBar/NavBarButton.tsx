import { NavLink } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { Link } from '../../Link';

export interface ButtonProps {
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

export default NavBarButton;
