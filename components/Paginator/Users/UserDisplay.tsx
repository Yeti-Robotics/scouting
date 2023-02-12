import { Link } from '@/components/Link';
import { UserI } from '@/models/User';
import { Box } from '@mantine/core';
import { DisplayProps } from '../Paginator';

const UserDisplay: React.VFC<DisplayProps<UserI>> = ({ record }) => {
	return (
		<Box>
			<Link href={`/records/users/${record._id}`} passHref>
				<Box>
					<h3>
						Name: {record.firstName} {record.lastName}
					</h3>
					<h4>Username: {record.username}</h4>
					<h4>Team: {record.teamNumber}</h4>
				</Box>
			</Link>
		</Box>
	);
};

export default UserDisplay;
