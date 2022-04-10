import { StandFormI } from '@/models/StandForm';
import Link from 'next/link';
import { DisplayContainer, DisplayWrapper } from '../Display.styles';
import { DisplayProps } from '../Paginator';

const StandFormDisplay: React.VFC<DisplayProps<StandFormI>> = ({ record }) => {
	return (
		<DisplayContainer>
			<Link href={`/records/stand-forms/${record._id}`} passHref>
				<DisplayWrapper>
					<h3>Match: {record.matchNumber}</h3>
					<h3>Team: {record.teamNumber}</h3>
					<h4>
						Scouter: {record.scouter?.firstName} {record.scouter?.lastName}
					</h4>
				</DisplayWrapper>
			</Link>
		</DisplayContainer>
	);
};

export default StandFormDisplay;
