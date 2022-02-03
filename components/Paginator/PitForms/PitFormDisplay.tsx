import { PitFormI } from '@/models/PitForm';
import Link from 'next/link';
import { DisplayContainer, DisplayWrapper } from '../Display.styles';
import { DisplayProps } from '../Paginator';

const PitFormDisplay: React.VFC<DisplayProps<PitFormI>> = ({ record }) => {
	return (
		<DisplayContainer>
			<Link href={`/records/pit-forms/${record._id}`} passHref>
				<DisplayWrapper>
					<h3>Team: {record.teamNumber}</h3>
					<h4>Scouter: {record.scouter}</h4>
				</DisplayWrapper>
			</Link>
		</DisplayContainer>
	);
};

export default PitFormDisplay;
