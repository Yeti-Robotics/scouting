'use client';

import { useState } from 'react';

const SPRLeaderboard = ({ data }: any) => {
	const [sortColumn, setSortColumn] = useState('avgSPR');
	const [ascending, setAscending] = useState(false);

	function handleHeaderClick(column) {
		console.log(ascending);
		if (column === sortColumn) {
			setAscending((curr) => !curr);
		} else {
			setSortColumn(column);
		}
	}

	return (
		<div className='relative overflow-x-auto shadow-md sm:rounded-xl'>
			<table className='w-full table-auto text-left text-sm text-gray-500 rtl:text-right dark:text-bubble-gum'>
				<thead className='bg-yeti-blue text-sm uppercase text-white'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3'
							onClick={() => handleHeaderClick('firstName')}
						>
							First Name
						</th>
						<th
							scope='col'
							className='px-6 py-3'
							onClick={() => handleHeaderClick('lastName')}
						>
							Last Name
						</th>
						<th
							scope='col'
							className='px-6 py-3'
							onClick={() => handleHeaderClick('avgSPR')}
						>
							SPR
						</th>
					</tr>
				</thead>

				<tbody>
					{data
						.filter((scout) => scout !== undefined)
						.sort((scoutA, scoutB) => {
							return ascending
								? scoutA[sortColumn] < scoutB[sortColumn]
									? -1
									: 1
								: scoutA[sortColumn] < scoutB[sortColumn]
									? 1
									: -1;
						})
						.map((scout) => {
							return (
								<tr className='border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800'>
									<td className='px-6 py-4'>{scout?.firstName}</td>
									<td className='px-6 py-4'>{scout?.lastName}</td>
									<td className='px-6 py-4'>{scout?.avgSPR}</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
};

export default SPRLeaderboard;
