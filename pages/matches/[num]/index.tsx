import MobileShootingTable from '@/components/MatchData/MobileShootingTable';
import ShootingTable from '@/components/MatchData/ShootingTable';
import Comments from '@/components/MatchData/Comments';
import Taxis from '@/components/MatchData/Taxis';
import fetcher from '@/lib/fetch';
import { useUser } from '@/lib/useUser';
import { MatchData } from '@/models/aggregations/matchData';
import { Checkbox, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const Match = () => {
	const router = useRouter();
	const isDesktop = useMediaQuery('(min-width:1000px)');
	const [table, setTable] = useState(false);
	useUser({ canRedirect: true });
	const { data: id } = useSWRImmutable<string>(
		router.isReady ? `/api/matches/num-to-id?number=${Number(router.query.num)}` : null,
		fetcher,
	);
	const { data } = useSWR<MatchData>(id ? `/api/matches/${id}/data` : null, fetcher);

	useEffect(() => setTable(isDesktop), []);

	if (!data) return <Loader size='xl' />;

	return (
		<>
			<h1>Match {router.query.num}</h1>
			<h1>Scoring</h1>
			{isDesktop && (
				<Checkbox
					label='Table View'
					checked={table}
					onChange={(e) => setTable(e.target.checked)}
				/>
			)}
			{isDesktop && !table ? (
				<>
					<ShootingTable match={data} auto={false} level='top' piece='cone' />
					<ShootingTable match={data} auto={false} level='top' piece='cube' />
					<ShootingTable match={data} auto={false} level='mid' piece='cone' />
					<ShootingTable match={data} auto={false} level='mid' piece='cube' />
					<ShootingTable match={data} auto={false} level='low' piece='cone' />
					<ShootingTable match={data} auto={false} level='low' piece='cube' />
					<ShootingTable match={data} auto level='top' piece='cone' />
					<ShootingTable match={data} auto level='top' piece='cone' />
					<ShootingTable match={data} auto level='mid' piece='cone' />
					<ShootingTable match={data} auto level='mid' piece='cone' />
					<ShootingTable match={data} auto level='low' piece='cone' />
					<ShootingTable match={data} auto level='low' piece='cone' />
				</>
			) : (
				<MobileShootingTable match={data} />
			)}
			<Taxis match={data} />
			<Comments match={data} />
		</>
	);
};

export default Match;
