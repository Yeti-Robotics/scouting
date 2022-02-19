import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Theme, ThemeContextProvider } from '@/Theme';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Yeti Scouting</title>
			</Head>
			<ThemeContextProvider>
				<Theme>
					<CssBaseline />
					<Component {...pageProps} />
				</Theme>
			</ThemeContextProvider>
		</>
	);
}

export default MyApp;
