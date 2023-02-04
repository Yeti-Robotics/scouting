import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { Box, Loader } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import ShootingTableBar from './ShootingTableBar';
import { getTitle, selectScoreKey } from '@/lib/matchDataUtils';

interface Props {
	match: MatchData;
	auto: boolean;
	level: 'top' | 'mid' | 'low';
	piece: 'cone' | 'cube';
}

const getAllData = (match: MatchData, key: keyof StandFormWithName, ifUndef: any = 0) => {
	const keys = ['blue1', 'blue2', 'blue3', 'red1', 'red2', 'red3'] as const;

	return keys.map((teamKey) => match[teamKey]?.[key] || ifUndef);
};

const ShootingTable = ({ match, auto, piece, level }: Props) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const [tableHeight, setTableHeight] = useState(0);
	const [loaded, setLoaded] = useState(false); // track when first render happens
	const [showBars, setShowBars] = useState(false);

	useEffect(() => setShowBars(true), []);

	useEffect(() => {
		setLoaded(true);

		const onResize = () => {
			if (!tableRef.current) return;
			setTableHeight(parseInt(getComputedStyle(tableRef.current).height));
		};
		window.addEventListener('resize', onResize);

		if (!tableRef.current) return;
		setTableHeight(parseInt(getComputedStyle(tableRef.current).height));
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const maxScored = Math.max(...getAllData(match, selectScoreKey({ auto, piece, level }), 0));

	return (
		<>
			<Box component='h2' sx={{ m: 2 }}>
				{getTitle({ auto, piece, level })}
			</Box>
			<Box
				ref={tableRef}
				sx={{
					display: 'flex',
					width: '95%',
					height: '500px',
				}}
			>
				{loaded && maxScored > 0 ? (
					<>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								width: 32,
								borderRight: '1px solid',
								height: '100%',
							}}
						>
							<span style={{ flexGrow: 1 }}>{maxScored}</span>
						</Box>

						{match.blue1 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.blue1}
								auto={auto}
								level={level}
								piece={piece}
								maxScored={maxScored}
								tableHeight={tableHeight}
								showBars={showBars}
							/>
						)}
						{match.blue2 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.blue2}
								auto={auto}
								level={level}
								piece={piece}
								maxScored={maxScored}
								tableHeight={tableHeight}
								showBars={showBars}
							/>
						)}
						{match.blue3 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.blue3}
								auto={auto}
								level={level}
								piece={piece}
								maxScored={maxScored}
								tableHeight={tableHeight}
								showBars={showBars}
							/>
						)}
						{match.red1 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.red1}
								auto={auto}
								level={level}
								piece={piece}
								maxScored={maxScored}
								tableHeight={tableHeight}
								showBars={showBars}
							/>
						)}
						{match.red2 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.red2}
								auto={auto}
								level={level}
								piece={piece}
								maxScored={maxScored}
								tableHeight={tableHeight}
								showBars={showBars}
							/>
						)}
						{match.red3 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.red3}
								auto={auto}
								level={level}
								piece={piece}
								maxScored={maxScored}
								tableHeight={tableHeight}
								showBars={showBars}
							/>
						)}
					</>
				) : maxScored <= 0 ? (
					<Box
						component='h1'
						style={{
							flexGrow: 1,
							display: 'grid',
							placeItems: 'center',
							height: '100%',
							border: '1px solid',
						}}
					>
						Nobody scored 💀
					</Box>
				) : (
					<Loader />
				)}
			</Box>
		</>
	);
};

export default ShootingTable;
