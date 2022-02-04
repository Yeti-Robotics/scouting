import { UserI } from '@/models/User';
import Link from 'next/link';
import { DisplayContainer, DisplayWrapper } from '../Display.styles';
import { DisplayProps } from '../Paginator';

const UserDisplay: React.VFC<DisplayProps<UserI>> = ({ record }) => {
	return (
		<DisplayContainer>
			<Link href={`/records/users/${record._id}`} passHref>
				<DisplayWrapper>
					<h3>
						Name: {record.firstName} {record.lastName}
					</h3>
					<h4>Username: {record.username}</h4>
					<h4>Team: {record.teamNumber}</h4>
				</DisplayWrapper>
			</Link>
		</DisplayContainer>
	);
};

export default UserDisplay;
