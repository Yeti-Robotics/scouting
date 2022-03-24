import { MatchData } from '@/models/aggregations/matchData';
import { useRef } from 'react';

interface Props {
	match: MatchData;
}

const ShootingTable: React.VFC<Props> = ({ match }) => {
	const tableRef = useRef<HTMLDivElement>(null);

	return <div ref={tableRef}></div>;
};

export default ShootingTable;
