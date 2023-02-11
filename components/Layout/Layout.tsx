import { Stack } from '@mantine/core';
import { ReactNode } from 'react';
import NavBar from './NavBar';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<Stack spacing={0}>
			<NavBar />
			<Stack align='center'>{children}</Stack>
		</Stack>
	);
};

export default Layout;
