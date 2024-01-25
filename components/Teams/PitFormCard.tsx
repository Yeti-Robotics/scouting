import { TeamData } from '@/models/aggregations/teamData';
import { PitFormI } from '@/models/PitForm';
import { Paper } from '@mantine/core';
import { Link } from '../Link';

interface Props {
	team: TeamData;
	form: PitFormI;
}

const PitFormCard = ({ form }: Props) => {
	return (
		<Paper
			component={Link}
			href={`/records/pit-forms/${form._id}`}
			passHref={true}
			withBorder
			p='md'
		>
			<h4>scouter: {form.scouter}</h4>
		</Paper>
	);
};

export default PitFormCard;
