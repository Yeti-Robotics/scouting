import { PitFormI } from '@/models/PitForm';
import Section from '../Section';
import Link from 'next/link';
import { Stack, Text, Title } from '@mantine/core';

export const PitInfo = ({ pitForm }: { pitForm: PitFormI | undefined }) => {
	return (
		<Section title='Pit Data' expanded={!!pitForm}>
			{pitForm ? (
				<Stack>
					<Link href={`/records/pit-forms/${pitForm._id}`}>form</Link>
					<Text>
						<strong>Drivetrain:</strong> {pitForm.drivetrain}
					</Text>
					<Text>
						<strong>Weight (pounds):</strong> {pitForm.weight}
					</Text>
					<Text>
						<strong>Dims (inches): </strong>
						{pitForm.length} x {pitForm.width}
					</Text>
					<Text>
						<strong>Can Score: </strong>
						{pitForm.whereScore.length > 0
							? pitForm.whereScore.join(', ')
							: 'Nowhere 😢'}
					</Text>
					<Text>
						<strong>Prefers to Score: </strong>
						{pitForm.priorityScore}
					</Text>
				</Stack>
			) : (
				<Title>
					No form for this team, <Link href='/pit-scouting'>Go make one!</Link>
				</Title>
			)}
		</Section>
	);
};
