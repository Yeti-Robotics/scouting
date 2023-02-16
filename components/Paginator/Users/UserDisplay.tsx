import { Link } from '@/components/Link';
import { UserI } from '@/models/User';
import { Card, Text } from '@mantine/core';
import { DisplayProps } from '../Paginator';

const UserDisplay = ({ record }: DisplayProps<UserI>) => {
	return (
		<Card component={Link} href={`/records/users/${record._id}`} withBorder shadow='md' p='md'>
			<Text size='md'>
				<strong>Name:</strong> {record.firstName} {record.lastName}
			</Text>

			<Text size='md'>
				<strong>Username:</strong> {record.username}
			</Text>
			<Text size='md'>
				<strong>Team:</strong> {record.teamNumber}
			</Text>
		</Card>
	);
};

export default UserDisplay;
