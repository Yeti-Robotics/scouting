import { StandFormI } from '@/models/StandForm';
import { ScatterPlotDatum, ScatterPlotSvgProps } from '@nivo/scatterplot';

export const calcAutoScore = (form: StandFormI) =>
	form.autoTopCones * 6 +
	form.autoTopCubes * 6 +
	form.autoMidCones * 4 +
	form.autoMidCubes * 4 +
	form.autoLowCones * 3 +
	form.autoLowCubes * 3;

export const calcTeleopScore = (form: StandFormI) =>
	form.teleopTopCones * 5 +
	form.teleopTopCubes * 5 +
	form.teleopMidCones * 3 +
	form.teleopMidCubes * 3 +
	form.teleopLowCones * 2 +
	form.teleopLowCubes * 2;

export const calcAutoPieces = (form: StandFormI) =>
	form.autoTopCones +
	form.autoTopCubes +
	form.autoMidCones +
	form.autoMidCubes +
	form.autoLowCones +
	form.autoLowCubes;

export const calcTeleopPieces = (form: StandFormI) =>
	form.teleopTopCones +
	form.teleopTopCubes +
	form.teleopMidCones +
	form.teleopMidCubes +
	form.teleopLowCones +
	form.teleopLowCubes;

export const commonProps = <T extends ScatterPlotDatum>(
	isDarkMode: boolean,
): Omit<ScatterPlotSvgProps<T>, 'data' | 'height' | 'width'> => ({
	theme: {
		textColor: isDarkMode ? 'white' : 'black',
	},
	colors: {
		scheme: isDarkMode ? 'set1' : 'set1',
	},
	margin: { top: 16, right: 140, bottom: 70, left: 90 },
	xScale: { type: 'linear', min: 1, max: 'auto' },
	xFormat: '>-.2f',
	yScale: { type: 'linear', min: 0, max: 'auto' },
	yFormat: '>-.2f',
	axisTop: null,
	axisRight: null,
	axisBottom: {
		tickSize: 5,
		tickPadding: 5,
		tickRotation: 0,
		legend: 'nth match',
		legendPosition: 'middle',
		legendOffset: 46,
	},
	axisLeft: {
		tickSize: 5,
		tickPadding: 5,
		tickRotation: 0,
		legend: 'points scored',
		legendPosition: 'middle',
		legendOffset: -60,
	},
	legends: [
		{
			anchor: 'bottom-right',
			direction: 'column',
			justify: false,
			translateX: 130,
			translateY: 0,
			itemWidth: 100,
			itemHeight: 12,
			itemsSpacing: 5,
			itemDirection: 'left-to-right',
			symbolSize: 12,
			symbolShape: 'circle',
			effects: [
				{
					on: 'hover',
					style: {
						itemOpacity: 1,
					},
				},
			],
		},
	],
});
