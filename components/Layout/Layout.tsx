import { Stack } from '@mantine/core';
import { ReactNode } from 'react';
import NavBar from './NavBar';
import { ThemeSwitch } from './ThemeSwitch';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<Stack spacing={0}>
			<NavBar />
			<ThemeSwitch />
			<Stack>{children}</Stack>
		</Stack>
	);
};

export default Layout;
