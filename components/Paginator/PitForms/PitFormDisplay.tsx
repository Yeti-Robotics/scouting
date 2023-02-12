import { Link } from '@/components/Link';
import { PitFormI } from '@/models/PitForm';
import { Box } from '@mantine/core';
import { DisplayProps } from '../Paginator';

const PitFormDisplay: React.VFC<DisplayProps<PitFormI>> = ({ record }) => {
	return (
		<Box>
			<Link href={`/records/pit-forms/${record._id}`} passHref>
				<Box>
					<h3>Team: {record.teamNumber}</h3>
					<h4>Scouter: {record.scouter}</h4>
				</Box>
			</Link>
		</Box>
	);
};

export default PitFormDisplay;
