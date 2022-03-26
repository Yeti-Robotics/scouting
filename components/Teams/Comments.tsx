import { StandFormI } from '@/models/StandForm';
import { Box, Divider } from '@mui/material';
import Section from '../Section';

interface Props {
	forms: StandFormI[];
}

const Comment: React.VFC<{ form: StandFormI }> = ({ form }) => {
	return (
		<Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
			<h4 style={{ marginBottom: 0 }}>{form.notes}</h4>
			<p style={{ marginTop: 0 }}>
				- {form.scouter.firstName} {form.scouter.lastName}
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
