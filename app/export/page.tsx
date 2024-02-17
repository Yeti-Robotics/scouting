'use client';

import { Button } from '@/components/ui/button';
import { MouseEventHandler } from 'react';

const exporter = (route: string, fileName: string) => {
	return async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const a = document.createElement('a');
		const res = await fetch(route);
		const data = await res.json();
		const url = URL.createObjectURL(
			new Blob(
				[
					JSON.stringify(
						data.map((team: any) => {
							const { __v, ...obj } = team;
							return obj;
						}),
					),
				],
				{ type: 'application/octetstream' },
			),
		);
		a.href = url;
		a.download = `${fileName}.json`;
		a.click();
	};
};

const Export = () => {
	return (
		<main className='mx-auto mt-12 max-w-[540px]'>
			<h1 className='typography mb-6 ml-2'>Export</h1>
			<div>
				<Button
					variant='outline'
					className='m-2'
					onClick={exporter('/api/export-team-data', 'team-data')}
				>
					Team Data
				</Button>
			</div>
			<div>
			<Button variant='outline' className='m-2' onClick={exporter('/api/export-stand-forms', 'stand-forms')}>
				Stand Form Data
			</Button>
			</div>
		</main>
	);
};

export default Export;
