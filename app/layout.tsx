import NavBar from '@/components/ui/navbar';
import './globals.css';
import { Libre_Franklin } from 'next/font/google';
import { cookies } from 'next/headers';
import { verifyUser } from '@/middleware/app-router/verify-user';

export const metadata = {
	title: 'YETI Scouting',
	description: 'FRC scouting app built by Yeti Robotics',
	manifest: "/manifest.json",
};

const openSans = Libre_Franklin({ subsets: ['latin'], display: 'swap', variable: '--font-os' });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const access_token = cookies().get('access_token')?.value;
	const { _id, isAdmin } = await verifyUser(access_token);

	return (
		<html lang='en'>
			<body className={`bg-eerie-black min-h-screen ${openSans.variable} max-w-full`}>
				<NavBar id={_id?.toString()} isAdmin={isAdmin} />
				<div className='relative top-12'>{children}</div>
			</body>
		</html>
	);
}
