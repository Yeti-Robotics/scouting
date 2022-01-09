import { Container } from '@mui/material';
import { MainContainer, PageContainer } from './Layout.styles';
import NavBar from './NavBar';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = ({ children }) => {
	return (
		<PageContainer>
			<NavBar />
			<MainContainer>{children}</MainContainer>
			<ThemeToggle />
		</PageContainer>
	);
};

export default Layout;
