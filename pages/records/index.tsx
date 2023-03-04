import { useUser } from '@/lib/useUser';
import { Group, Title } from '@mantine/core';
import { IconUser, IconFile, IconFlame } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { Link } from '@/components/Link';

interface MenuCardProps {
	href: string;
	text: string;
	Icon?: JSX.Element;
}

const MenuCard = ({ href, text, Icon }: MenuCardProps) => {
	return (
		<Button component={Link} href={href} leftIcon={Icon}>
			{text}
		</Button>
	);
};

const Records = () => {
	const { user } = useUser({ canRedirect: false });

	return (
		<>
			<Title order={1}>Records</Title>
			<Group position='center'>
				<MenuCard href='/records/stand-forms' text='Stand Forms' Icon={<IconUser />} />
				<MenuCard href='/records/pit-forms' text='Pit Forms' Icon={<IconFile />} />
				{user?.administrator && (
					<MenuCard href='/records/users' text='Users' Icon={<IconUser />} />
				)}
			</Group>
			<Button component={Link} href='/records/verify-forms'>
				Verify Match Forms
			</Button>
			<Button
				leftIcon={<IconFlame />}
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
				Clean DB
			</Button>
			{user?.administrator && (
				<Button
					onClick={() =>
						openConfirmModal({
							title: 'Awe you shure? 🥺',
							children: 'Approve all stand forms????!??! 😱',
							confirmProps: { color: 'red', children: 'Approve them all 😈' },
							cancelProps: { children: 'Go back 😭' },
							onConfirm: () => fetch(`/api/approve-all`),
						})
					}
				>
					Approve all stand forms
				</Button>
			)}
		</>
	);
};

export default Records;
