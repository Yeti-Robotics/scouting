import { MatchData } from '@/models/aggregations/matchData';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ShootingTableBar from './ShootingTableBar';

interface Props {
	match: MatchData;
	auto: boolean;
	low: boolean;
}

const getAllData = (match: MatchData, key: keyof StandFormWithName, ifUndef: any = 0) => {
	const keys = ['blue1', 'blue2', 'blue3', 'red1', 'red2', 'red3'] as const;

	return keys.map((teamKey) => match[teamKey]?.[key] || ifUndef);
};

const selectScoreKey = ({
	auto,
	low,
}: {
	auto: boolean;
	low: boolean;
}): keyof StandFormWithName => {
	if (auto && low) return 'autoLowBallsScored';
	if (auto && !low) return 'autoUpperBallsScored';
	if (!auto && low) return 'teleopLowBallsScored';
	if (!auto && !low) return 'teleopUpperBallsScored';
	throw new Error('How did we get here?');
};

const getTitle = ({ auto, low }: { auto: boolean; low: boolean }) => {
	if (auto && low) return 'Auto Low Balls';
	if (auto && !low) return 'Auto Upper Balls';
	if (!auto && low) return 'Teleop Low Balls';
	if (!auto && !low) return 'Teleop Upper Balls';
	throw new Error('How did we get here? 2');
};

const ShootingTable: React.VFC<Props> = ({ match, auto, low }) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const [tableHeight, setTableHeight] = useState(0);
	const [loaded, setLoaded] = useState(false); // track when first render happens

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

	const maxScored = Math.max(...getAllData(match, selectScoreKey({ auto, low }), 0));

	return (
		<>
			<Box component='h2' sx={{ m: 2 }}>
				{getTitle({ auto, low })}
			</Box>
			<Box
				ref={tableRef}
				sx={{
					display: 'flex',
					width: '100%',
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
								low={low}
								maxScored={maxScored}
								tableHeight={tableHeight}
							/>
						)}
						{match.blue2 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.blue2}
								auto={auto}
								low={low}
								maxScored={maxScored}
								tableHeight={tableHeight}
							/>
						)}
						{match.blue3 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.blue3}
								auto={auto}
								low={low}
								maxScored={maxScored}
								tableHeight={tableHeight}
							/>
						)}
						{match.red1 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.red1}
								auto={auto}
								low={low}
								maxScored={maxScored}
								tableHeight={tableHeight}
							/>
						)}
						{match.red2 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.red2}
								auto={auto}
								low={low}
								maxScored={maxScored}
								tableHeight={tableHeight}
							/>
						)}
						{match.red3 && (
							<ShootingTableBar
								table={tableRef.current as HTMLDivElement}
								match={match}
								team={match.red3}
								auto={auto}
								low={low}
								maxScored={maxScored}
								tableHeight={tableHeight}
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
					<CircularProgress />
				)}
			</Box>
		</>
	);
};

export default ShootingTable;
