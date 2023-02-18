import { TeamData } from '@/models/aggregations/teamData';
import { PitFormI } from '@/models/PitForm';
import { Box } from '@mantine/core';
import Link from 'next/link';

interface Props {
	team: TeamData;
	form: PitFormI;
}

const PitFormCard = ({ form }: Props) => {
	return (
		<Link href={`/records/pit-forms/${form._id}`} passHref={true}>
			<Box component='a'>
				<Box>
					<h4>scouter: {form.scouter}</h4>
				</Box>
			</Box>
		</Link>
	);
};

export default PitFormCard;
