import { StandFormI } from '@/models/StandForm';
import { ScatterPlotDatum, ScatterPlotSvgProps } from '@nivo/scatterplot';

export const calcAutoScore = (form: StandFormI) =>
	form.autoAmpNotes * 2 + form.autoSpeakerNotes * 5;

export const calcTeleopScore = (form: StandFormI) =>
	form.teleopAmpNotes * 5 + form.teleopSpeakerNotes * 5 + form.teleopAmplifiedSpeakerNotes * 3;

export const calcAutoPieces = (form: StandFormI) => form.autoAmpNotes + form.autoSpeakerNotes;

export const calcTeleopPieces = (form: StandFormI) =>
	form.teleopAmpNotes + form.teleopSpeakerNotes + form.teleopAmplifiedSpeakerNotes;

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
