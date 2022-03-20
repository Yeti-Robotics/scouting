import Layout from '@/components/Layout';
import { Button } from '@mui/material';
import { MouseEventHandler } from 'react';

const exporter = (route: string): MouseEventHandler<HTMLAnchorElement> => {
	return async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const a = document.createElement('a');
		const res = await fetch(route);
		const data = await res.json();
		const url = URL.createObjectURL(
			new Blob([JSON.stringify(data)], { type: 'application/octetstream' }),
		);
		a.href = url;
		a.download = 'team-data.json';
		a.click();
	};
};

const Export = () => {
	return (
		<Layout>
			<h1>Export</h1>
			<Button component='a' variant='contained' onClick={exporter('/api/export-team-data')}>
				Team Data
			</Button>
		</Layout>
	);
};

export default Export;
