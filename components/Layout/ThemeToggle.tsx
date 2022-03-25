import { ThemeContext } from '@/Theme';
import { DarkMode, LightMode } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useContext } from 'react';

const ThemeToggle = () => {
	const { mode, toggleTheme } = useContext(ThemeContext);

	return (
		<Box style={{ display: 'flex', justifyContent: 'center' }}>
			<Button onClick={toggleTheme} variant='outlined' size='large'>
				{mode === 'light' ? <DarkMode /> : <LightMode />}
			</Button>
		</Box>
	);
};

export default ThemeToggle;
