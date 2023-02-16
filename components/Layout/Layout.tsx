import { Stack } from '@mantine/core';
import { ReactNode } from 'react';
import NavBar from './NavBar';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<Stack spacing={0} pb='md'>
			<NavBar />
			<Stack align='center' pt='5rem'>
				{children}
			</Stack>
		</Stack>
	);
};

export default Layout;
