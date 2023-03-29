import { PipelineStage } from 'mongoose';
import { PitFormI } from '../PitForm';

export const matchWPit: PipelineStage[] = [
	{
		$sort: {
			matchNumber: 1,
		},
	},
	{
		$lookup: {
			from: 'pitForms',
			localField: 'blue1',
			foreignField: 'teamNumber',
			as: 'blue1',
		},
	},
	{
		$lookup: {
			from: 'pitForms',
			localField: 'blue2',
			foreignField: 'teamNumber',
			as: 'blue2',
		},
	},
	{
		$lookup: {
			from: 'pitForms',
			localField: 'blue3',
			foreignField: 'teamNumber',
			as: 'blue3',
		},
	},
	{
		$lookup: {
			from: 'pitForms',
			localField: 'red1',
			foreignField: 'teamNumber',
			as: 'red1',
		},
	},
	{
		$lookup: {
			from: 'pitForms',
			localField: 'red2',
			foreignField: 'teamNumber',
			as: 'red2',
		},
	},
	{
		$lookup: {
			from: 'pitForms',
			localField: 'red3',
			foreignField: 'teamNumber',
			as: 'red3',
		},
	},
	{
		$project: {
			matchNumber: true,
			blue1: {
				$first: '$blue1',
			},
			blue2: {
				$first: '$blue2',
			},
			blue3: {
				$first: '$blue3',
			},
			red1: {
				$first: '$red1',
			},
			red2: {
				$first: '$red2',
			},
			red3: {
				$first: '$red3',
			},
		},
	},
];

export type MatchWPit = {
	_id: string;
	matchNumber: number;
	blue1?: PitFormI;
	blue2?: PitFormI;
	blue3?: PitFormI;
	red1?: PitFormI;
	red2?: PitFormI;
	red3?: PitFormI;
};
