import FlexGrid from '@/components/FlexGrid';
import Layout from '@/components/Layout';
import { useUser } from '@/lib/useUser';
import { AccountCircle, InsertDriveFile } from '@mui/icons-material';
import { Box, Button, Modal } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

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
	const [cleanModal, setCleanModal] = useState(false);

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
			<Button variant='contained' onClick={() => setCleanModal(true)}>
				Clean db
			</Button>
			<Modal open={cleanModal} onClose={() => setCleanModal(false)}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4,
					}}
				>
					<p>
						Performing this action will remove all forms, matches, and bets currently in
						the database, are you sure you wish to do this
					</p>
					<Button
						color='error'
						variant='contained'
						onClick={() => {
							fetch(`/api/clean-db`).then((res) => {
								if (res.ok) {
									setCleanModal(false);
								}
							});
						}}
					>
						Yes, Do It
					</Button>
					<Button
						color='success'
						variant='contained'
						onClick={() => setCleanModal(false)}
					>
						Nah, Go Back
					</Button>
				</Box>
			</Modal>
		</Layout>
	);
};

export default Records;
