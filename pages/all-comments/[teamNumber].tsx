import { GetServerSideProps, NextPage } from 'next';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import pemForms from '@/past-data/pem-stand-forms.json';
import ashForms from '@/past-data/ash-stand-forms.json';
import { Paper, Stack } from '@mui/material';
import { StandFormI } from '@/models/StandForm';

const CommentDisplay: React.VFC<{ form: StandFormI }> = ({ form }) => {
	return (
		<Paper sx={{ m: 1, p: 1 }}>
			<p>{form.notes.trim() || 'No comment'}</p>
		</Paper>
	);
};

const TeamComments: NextPage<{ forms: StandFormI[] }> = ({ forms }) => {
	const router = useRouter();

	return (
		<Layout>
			<h1>{router.query.teamNumber} Comments</h1>
			<Stack sx={{ m: 2 }}>
				{forms.map((form) => (
					<CommentDisplay key={form._id} form={form} />
				))}
			</Stack>
		</Layout>
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
