import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
	mode: 'dark' as 'dark' | 'light',
	toggleTheme: () => {},
});

export const ThemeContextProvider: React.FC = ({ children }) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = useState<'light' | 'dark'>('dark');

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
		const systemPreference = prefersDarkMode ? 'dark' : 'light';
		setMode(savedTheme ? savedTheme : systemPreference);
	}, [prefersDarkMode]);

	const toggleTheme = useCallback(() => {
		const savedTheme = mode === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', savedTheme);
		setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
	}, [mode]);

	return <ThemeContext.Provider value={{ mode, toggleTheme }}>{children}</ThemeContext.Provider>;
};

const themeWithMode = (mode: 'light' | 'dark') =>
	mode === 'light'
		? createTheme({
				palette: {
					mode: 'light',
					primary: { main: '#54B6E5' },
				},
		  })
		: createTheme({
				palette: {
					mode: 'dark',
					primary: { main: '#54B6E5' },
				},
		  });

export const Theme: React.FC = ({ children }) => {
	const { mode } = useContext(ThemeContext);
	return <ThemeProvider theme={themeWithMode(mode)}>{children}</ThemeProvider>;
};
