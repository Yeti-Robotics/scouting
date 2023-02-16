import { Link } from '@/components/Link';
import { StandFormI } from '@/models/StandForm';
import { Card, Text } from '@mantine/core';
import { DisplayProps } from '../Paginator';

const StandFormDisplay = ({ record }: DisplayProps<StandFormI>) => {
	return (
		<Card
			component={Link}
			href={`/records/stand-forms/${record._id}`}
			withBorder
			shadow='md'
			p='md'
		>
			<Text size='md'>
				<strong>Match:</strong> {record.matchNumber}
			</Text>
			<Text size='md'>
				<strong>Team:</strong> {record.teamNumber}
			</Text>
			<Text size='md'>
				<strong>Scouter:</strong> {record.scouter?.firstName} {record.scouter?.lastName}
			</Text>
		</Card>
	);
};

export default StandFormDisplay;
