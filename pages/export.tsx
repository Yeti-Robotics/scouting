import Layout from '@/components/Layout';
import { Button } from '@mui/material';

const exporter = (route: string) => {
	return async (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const a: HTMLAnchorElement = (e as any).target;
		const res = await fetch(route);
		const data = await res.json();
		const url = URL.createObjectURL(new Blob([data], { type: 'application/octetstream' }));
		a.href = url;
		a.download = 'team-data.json';
		a.click();
	};
};

const Export = () => {
	return (
		<Layout>
			<h1>Export</h1>
			<Button variant='contained' onClick={exporter('/api/export-team-data')}>
				Team Data
			</Button>
		</Layout>
	);
};

export default Export;
