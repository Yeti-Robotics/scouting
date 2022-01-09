import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Theme, ThemeContextProvider } from '@/Theme';
import { CssBaseline } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeContextProvider>
			<Theme>
				<CssBaseline />
				<Component {...pageProps} />
			</Theme>
		</ThemeContextProvider>
	);
}

export default MyApp;
