import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Paper } from '@mantine/core';
import { Link } from '../Link';

interface Props {
	team: TeamData;
	form: StandFormI;
}

const StandFormCard = ({ team, form }: Props) => {
	return (
		<Paper withBorder component={Link} href={`/records/stand-forms/${form._id}`} p='md'>
			<h3>Match #: {form.matchNumber}</h3>
			<h4>
				scouter: {form.scouter?.firstName} {form.scouter?.lastName}
			</h4>
		</Paper>
	);
};

export default StandFormCard;
