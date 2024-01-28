const SPRLeaderboard = ({ data }: any) => {
	return (
		<div className='relative mx-4 overflow-x-auto rounded-lg shadow-md'>
			<table className='w-full table-auto text-left text-sm text-gray-500 rtl:text-right dark:text-bubble-gum'>
				<thead className='bg-yeti-blue text-sm uppercase text-white'>
					<tr>
						<th scope='col' className='px-6 py-3'>
							First Name
						</th>
						<th scope='col' className='px-6 py-3'>
							Last Name
						</th>
						<th scope='col' className='px-6 py-3'>
							SPR
						</th>
					</tr>
				</thead>

				<tbody>
					{data
						.filter((scout) => scout !== undefined)
						.sort((scoutA, scoutB) => scoutB.avgSPR - scoutA.avgSPR)
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
