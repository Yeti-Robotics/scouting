import FlexGrid from '@/components/FlexGrid';
import Layout from '@/components/Layout';
import { useUser } from '@/lib/useUser';
import { AccountCircle, InsertDriveFile } from '@mui/icons-material';
import { Button } from '@mui/material';
import Link from 'next/link';

interface MenuCardProps {
	href: string;
	text: string;
	Icon?: JSX.Element;
}

const MenuCard: React.VFC<MenuCardProps> = ({ href, text, Icon }) => {
	return (
		<Link href={href} passHref>
			<Button
				component='a'
				sx={{
					color: 'text.primary',
					backgroundColor: 'primary.main',
					display: 'flex',
					alignItems: 'center',
					padding: 2,
					margin: 1,
					borderRadius: 1,
					textTransform: 'none',
				}}
				variant='contained'
			>
				{Icon} {text}
			</Button>
		</Link>
	);
};

const Records = () => {
	const { user } = useUser({ canRedirect: false });

	return (
		<Layout>
			<h1>Records</h1>
			<FlexGrid>
				<MenuCard
					href='/records/stand-forms'
					text='Stand Forms'
					Icon={<InsertDriveFile sx={{ mr: 1 }} />}
				/>
				<MenuCard
					href='/records/pit-forms'
					text='Pit Forms'
					Icon={<InsertDriveFile sx={{ mr: 1 }} />}
				/>
				{user?.administrator && (
					<MenuCard
						href='/records/users'
						text='Users'
						Icon={<AccountCircle sx={{ mr: 1 }} />}
					/>
				)}
			</FlexGrid>
		</Layout>
	);
};

export default Records;
