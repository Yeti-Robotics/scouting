import { Link } from '@/components/Link';
import { StandFormI } from '@/models/StandForm';
import { Box } from '@mantine/core';
import { DisplayProps } from '../Paginator';

const StandFormDisplay: React.VFC<DisplayProps<StandFormI>> = ({ record }) => {
	return (
		<Box>
			<Link href={`/records/stand-forms/${record._id}`} passHref>
				<Box>
					<h3>Match: {record.matchNumber}</h3>
					<h3>Team: {record.teamNumber}</h3>
					<h4>
						Scouter: {record.scouter?.firstName} {record.scouter?.lastName}
					</h4>
				</Box>
			</Link>
		</Box>
	);
};

export default StandFormDisplay;
