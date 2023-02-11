import { useUser } from '@/lib/useUser';
import { Group, Title } from '@mantine/core';
import { IconUser, IconFile } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { Link } from '@/components/Link';

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
		<>
			<Title order={1}>Records</Title>
			<Group>
				<MenuCard href='/records/stand-forms' text='Stand Forms' Icon={<IconUser />} />
				<MenuCard href='/records/pit-forms' text='Pit Forms' Icon={<IconFile />} />
				{user?.administrator && (
					<MenuCard href='/records/users' text='Users' Icon={<IconUser />} />
				)}
			</Group>
			<Button
				variant='contained'
				onClick={() =>
					openConfirmModal({
						title: 'Awe you shure? 🥺',
						children: 'Delete everything????!??! 😱',
						confirmProps: { color: 'red', children: 'Delete it all 😈' },
						cancelProps: { children: 'Go back 😭' },
						onConfirm: () => fetch(`/api/clean-db`),
					})
				}
			>
				Clean db
			</Button>
			{user?.administrator && (
				<Button variant='contained' onClick={() => fetch('/api/approve-all')}>
					Approve all stand form
				</Button>
			)}
		</>
	);
};

export default Records;
