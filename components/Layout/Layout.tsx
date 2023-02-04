import { ReactNode } from 'react';
import { MainContainer, PageContainer } from './Layout.styles';
import NavBar from './NavBar';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<PageContainer>
			<NavBar />
			<MainContainer>{children}</MainContainer>
			<ThemeToggle />
		</PageContainer>
	);
};

export default Layout;
