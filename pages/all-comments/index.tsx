import { Button, NumberInput } from '@mantine/core';
import { Link } from '@/components/Link';
import { useState } from 'react';

const AllComments = () => {
	const [teamNumber, setTeamNumber] = useState<number | ''>('');

	return (
		<>
			<h1>All Comments</h1>
			<NumberInput label='Team Number' value={teamNumber} onChange={setTeamNumber} />
			<Button href={`/all-comments/${teamNumber}`} component={Link} sx={{ mt: 2 }}>
				View Comments
			</Button>
		</>
	);
};

export default AllComments;
