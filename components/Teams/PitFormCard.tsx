import { TeamData } from '@/models/aggregations/teamData';
import { PitFormI } from '@/models/PitForm';
import Link from 'next/link';

interface Props {
	team: TeamData;
	form: PitFormI;
}

const DataWrapper = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	width: 100%;

	h4 {
		margin: 1rem;
	}
`;

const CardWrapper = styled.a`
	margin: 0.5rem;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 1;
	background-color: ${({ theme }) => theme.palette.primary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

const PitFormCard: React.VFC<Props> = ({ team, form }) => {
	return (
		<Link href={`/records/pit-forms/${form._id}`} passHref={true}>
			<CardWrapper>
				<DataWrapper>
					<h4>scouter: {form.scouter}</h4>
				</DataWrapper>
			</CardWrapper>
		</Link>
	);
};

export default PitFormCard;
