import Layout from '@/components/Layout';
import { Button, TextField } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

const AllComments = () => {
	const [teamNumber, setTeamNumber] = useState<number | null>(null);

	return (
		<Layout>
			<h1>All Comments</h1>
			<TextField
				value={teamNumber}
				onChange={(e) => setTeamNumber(parseInt(e.target.value))}
				inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
			/>
			<Link href={`/all-comments/${teamNumber}`} passHref>
				<Button component='a'>View Comments</Button>
			</Link>
		</Layout>
	);
};

export default AllComments;
