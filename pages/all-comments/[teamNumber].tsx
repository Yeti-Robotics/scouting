import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import pemForms from '@/past-data/pem-stand-forms.json';
import ashForms from '@/past-data/ash-stand-forms.json';
import { Card, Stack, Text } from '@mantine/core';
import { StandFormI } from '@/models/StandForm';

const CommentDisplay = ({ form }: { form: StandFormI }) => {
	return (
		<Card withBorder shadow='md' m='md'>
			<Text>{form.notes.trim() || 'No comment'}</Text>
		</Card>
	);
};

const TeamComments: NextPage<{ forms: StandFormI[] }> = ({ forms }) => {
	const router = useRouter();

	return (
		<>
			<h1>{router.query.teamNumber} Comments</h1>
			<Stack>
				{forms.map((form) => (
					<CommentDisplay key={form._id} form={form} />
				))}
			</Stack>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	if (!query.teamNumber)
		return {
			notFound: true,
		};

	return {
		props: {
			forms: ashForms
				.concat(pemForms)
				.filter((form) => form.teamNumber === parseInt(String(query.teamNumber))),
		},
	};
};

export default TeamComments;
