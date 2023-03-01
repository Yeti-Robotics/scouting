import { StandFormI } from '@/models/StandForm';
import { Box, Divider } from '@mantine/core';
import { Link } from '../Link';
import Section from '../Section';

interface Props {
	forms: StandFormI[];
}

const Comment = ({ form }: { form: StandFormI }) => {
	return (
		<Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
			<Link href={`/matches/${form.matchNumber}`} passHref>
				Match {form.matchNumber}
			</Link>
			<h4 style={{ margin: 0 }}>"{form.notes}"</h4>
			<p style={{ marginTop: 0 }}>
				- {form.scouter?.firstName} {form.scouter?.lastName}
			</p>
		</Box>
	);
};

const Comments = ({ forms }: Props) => {
	return (
		<Section title='Comments'>
			{forms.map((form, i) => (
				<>
					<Comment form={form} />
					{i !== forms.length - 1 && <Divider />}
				</>
			))}
		</Section>
	);
};

export default Comments;
