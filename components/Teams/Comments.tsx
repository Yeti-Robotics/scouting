import { StandFormI } from '@/models/StandForm';
import { Box, Divider, NavLink } from '@mantine/core';
import Link from 'next/link';
import Section from '../Section';

interface Props {
	forms: StandFormI[];
}

const Comment: React.VFC<{ form: StandFormI }> = ({ form }) => {
	return (
		<Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
			<Link href={`/matches/${form.matchNumber}`} passHref>
				<NavLink sx={{ fontWeight: 'bold', mt: '1.33rem' }}>
					Match {form.matchNumber}
				</NavLink>
			</Link>
			<h4 style={{ margin: 0 }}>{form.notes}</h4>
			<p style={{ marginTop: 0 }}>
				- {form.scouter?.firstName} {form.scouter?.lastName}
			</p>
		</Box>
	);
};

const Comments: React.VFC<Props> = ({ forms }) => {
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
