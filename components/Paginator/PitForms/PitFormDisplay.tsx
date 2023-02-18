import { Link } from '@/components/Link';
import { PitFormI } from '@/models/PitForm';
import { Card, Title } from '@mantine/core';
import { DisplayProps } from '../Paginator';

const PitFormDisplay = ({ record }: DisplayProps<PitFormI>) => {
	return (
		<Card
			component={Link}
			href={`/records/pit-forms/${record._id}`}
			withBorder
			shadow='md'
			p='md'
		>
			<Title order={3}>
				<strong>Team:</strong> {record.teamNumber}
			</Title>
			<Title order={4}>
				<strong>Scouter:</strong> {record.scouter}
			</Title>
		</Card>
	);
};

export default PitFormDisplay;
