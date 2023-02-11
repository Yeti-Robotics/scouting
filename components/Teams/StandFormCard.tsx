import { TeamData } from '@/models/aggregations/teamData';
import { StandFormI } from '@/models/StandForm';
import { Box } from '@mantine/core';
import Link from 'next/link';

interface Props {
	team: TeamData;
	form: StandFormI;
}

const StandFormCard = ({ team, form }: Props) => {
	return (
		<Link href={`/records/stand-forms/${form._id}`} passHref={true}>
			<Box component='a'>
				<h3>Match #: {form.matchNumber}</h3>
				<Box>
					<h4>
						scouter: {form.scouter?.firstName} {form.scouter?.lastName}
					</h4>
				</Box>
			</Box>
		</Link>
	);
};

export default StandFormCard;
