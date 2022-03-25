import Layout from '@/components/Layout';
import LoadingLayout from '@/components/Layout/LoadingLayout';
import EndPositions from '@/components/MatchData/EndPositions';
import MobileShootingTable from '@/components/MatchData/MobileShootingTable';
import ShootingTable from '@/components/MatchData/ShootingTable';
import Taxis from '@/components/MatchData/Taxis';
import fetcher from '@/lib/fetch';
import { MatchData } from '@/models/aggregations/matchData';
import { Checkbox, FormControlLabel, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const Match = () => {
	const router = useRouter();
	const isDesktop = useMediaQuery('(min-width:1000px)');
	const [table, setTable] = useState(false);
	const { data: id } = useSWRImmutable<string>(
		router.isReady ? `/api/matches/num-to-id?number=${Number(router.query.num)}` : null,
		fetcher,
	);
	const { data } = useSWR<MatchData>(id ? `/api/matches/${id}/data` : null, fetcher);

	useEffect(() => setTable(isDesktop), []);

	if (!data) return <LoadingLayout />;
	console.log(table);

	return (
		<Layout>
			<h1>Match {router.query.num}</h1>
			<h1>Scoring</h1>
			{isDesktop && (
				<FormControlLabel
					control={
						<Checkbox
							value={table}
							checked={table}
							onChange={() => setTable((prev) => !prev)}
						/>
					}
					label='Table View'
				/>
			)}
			{isDesktop && !table ? (
				<>
					<ShootingTable match={data} auto={false} low={false} />
					<ShootingTable match={data} auto={false} low />
					<ShootingTable match={data} auto low={false} />
					<ShootingTable match={data} auto low />
				</>
			) : (
				<MobileShootingTable match={data} />
			)}
			<EndPositions match={data} />
			<Taxis match={data} />
		</Layout>
	);
};

export default Match;
