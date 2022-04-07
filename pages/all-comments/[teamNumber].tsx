import { GetServerSideProps, NextPage } from 'next';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '@/lib/fetch';
import pemForms from '@/past-data/pem-stand-forms.json';
import ashForms from '@/past-data/ash-stand-forms.json';
import { Paper, Stack } from '@mui/material';
import { StandFormI } from '@/models/StandForm';
import LoadingLayout from '@/components/Layout/LoadingLayout';

const CommentDisplay: React.VFC<{ form: StandFormI }> = ({ form }) => {
	return (
		<Paper sx={{ m: 1, p: 1 }}>
			<p>{form.notes.trim() || 'No comment'}</p>
		</Paper>
	);
};

const TeamComments: NextPage<{ fallback: Record<string, any> }> = ({ fallback }) => {
	const router = useRouter();
	const { data } = useSWR<StandFormI[]>(
		`/api/all-comments?teamNumber=${router.query.teamNumber}`,
		fetcher,
		{
			fallback,
		},
	);
	console.log(data);

	if (!data) return <LoadingLayout />;

	return (
		<Layout>
			<h1>{router.query.teamNumber} Comments</h1>
			<Stack sx={{ m: 2 }}>
				{data.map((form) => (
					<CommentDisplay key={form._id} form={form} />
				))}
			</Stack>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const key = `/api/all-comments?teamNumber=${query.teamNumber}`;

	return {
		props: {
			fallback: {
				[key]: ashForms
					.concat(pemForms)
					.filter((form) =>
						query.teamNumber ? form.teamNumber.toString() === query.teamNumber : true,
					),
			},
		},
	};
};

export default TeamComments;
