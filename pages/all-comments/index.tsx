import Layout from '@/components/Layout';
import { Button, NumberInput } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';

const AllComments = () => {
	const [teamNumber, setTeamNumber] = useState<number | ''>('');

	return (
		<Layout>
			<h1>All Comments</h1>
			<NumberInput label='Team Number' value={teamNumber} onChange={setTeamNumber} />
			<Link href={`/all-comments/${teamNumber}`} passHref>
				<Button variant='contained' component='a' sx={{ mt: 2 }}>
					View Comments
				</Button>
			</Link>
		</Layout>
	);
};

export default AllComments;
