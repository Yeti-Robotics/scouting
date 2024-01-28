import './globals.css';
import { Open_Sans } from 'next/font/google';

export const metadata = {
	title: 'Next.js',
	description: 'Generated by Next.js',
};

const openSans = Open_Sans({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={openSans.className}>{children}</body>
		</html>
	);
}
