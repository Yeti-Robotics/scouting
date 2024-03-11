'use client';

import { RawTeamData } from '@/models/aggregations/teamData';
import {
	LineChart,
	ResponsiveContainer,
	XAxis,
	Line,
	YAxis,
	Tooltip,
	Label,
	Legend,
} from 'recharts';

const COLORS = ['#54b6e5', '#8DE969', '#F1BBD7', '#6B769E'];

interface ChartProps {
	data: RawTeamData[];
	series: string[];
}

export default function Chart({ data, series }: ChartProps) {
	return (
		<ResponsiveContainer width='100%' height={400}>
			<LineChart
				width={500}
				height={400}
				data={data}
				margin={{ left: -5, bottom: 15, right: 30, top: 0 }}
			>
				<XAxis dataKey='_id.matchNumber'>
					<Label value='Match Number' offset={-10} position='insideBottom' />
				</XAxis>
				<YAxis width={50} />
				<Tooltip />
				<Legend
					layout='horizontal'
					verticalAlign='top'
					align='center'
					className='relative mt-[10px]'
				/>
				{series.map((s, i) => (
					<Line
						key={s}
						type='monotone'
						dataKey={s}
						strokeWidth={3}
						stroke={COLORS[i % COLORS.length]}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}
