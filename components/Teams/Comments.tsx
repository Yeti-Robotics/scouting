import { StandFormI } from '@/models/StandForm';
import { Anchor, Divider, Group, Paper } from '@mantine/core';
import { Link } from '../Link';
import Section from '../Section';

interface Props {
	forms: StandFormI[];
}

const Comment = ({ form }: { form: StandFormI }) => {
	return (
		<Paper
			component={Link}
			href={`/records/stand-forms/${form._id}`}
			withBorder
			shadow='md'
			p='md'
		>
			<Anchor href=''>Match {form.matchNumber}</Anchor>
			<h4 style={{ margin: 0 }}>"{form.notes}"</h4>
			<p style={{ marginTop: 0 }}>
				-{form.scouter?.firstName} {form.scouter?.lastName}
			</p>
		</Paper>
	);
};

const Comments = ({ forms }: Props) => {
	return (
		<Section title='Comments'>
			<Group align='center' position='center'>
				{forms.map((form, i) => (
					<>
						<Comment form={form} />
						{i !== forms.length - 1 && <Divider />}
					</>
				))}
			</Group>
		</Section>
	);
};

export default Comments;
