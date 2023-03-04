import { PipelineStage } from 'mongoose';
import { StandFormI } from '../StandForm';

export const matchWForms: PipelineStage[] = [
	{
		$sort: {
			matchNumber: 1,
		},
	},
	{
		$lookup: {
			from: 'standForms',
			localField: 'blue1',
			foreignField: 'teamNumber',
			as: 'blue1',
		},
	},
	{
		$lookup: {
			from: 'standForms',
			localField: 'blue2',
			foreignField: 'teamNumber',
			as: 'blue2',
		},
	},
	{
		$lookup: {
			from: 'standForms',
			localField: 'blue3',
			foreignField: 'teamNumber',
			as: 'blue3',
		},
	},
	{
		$lookup: {
			from: 'standForms',
			localField: 'red1',
			foreignField: 'teamNumber',
			as: 'red1',
		},
	},
	{
		$lookup: {
			from: 'standForms',
			localField: 'red2',
			foreignField: 'teamNumber',
			as: 'red2',
		},
	},
	{
		$lookup: {
			from: 'standForms',
			localField: 'red3',
			foreignField: 'teamNumber',
			as: 'red3',
		},
	},
	{
		$project: {
			matchNumber: true,
			blue1: {
				$first: {
					$filter: {
						input: '$blue1',
						cond: {
							$eq: ['$$this.matchNumber', '$matchNumber'],
						},
					},
				},
			},
			blue2: {
				$first: {
					$filter: {
						input: '$blue2',
						cond: {
							$eq: ['$$this.matchNumber', '$matchNumber'],
						},
					},
				},
			},
			blue3: {
				$first: {
					$filter: {
						input: '$blue3',
						cond: {
							$eq: ['$$this.matchNumber', '$matchNumber'],
						},
					},
				},
			},
			red1: {
				$first: {
					$filter: {
						input: '$red1',
						cond: {
							$eq: ['$$this.matchNumber', '$matchNumber'],
						},
					},
				},
			},
			red2: {
				$first: {
					$filter: {
						input: '$red2',
						cond: {
							$eq: ['$$this.matchNumber', '$matchNumber'],
						},
					},
				},
			},
			red3: {
				$first: {
					$filter: {
						input: '$red3',
						cond: {
							$eq: ['$$this.matchNumber', '$matchNumber'],
						},
					},
				},
			},
		},
	},
];

export type MatchWForms = {
	_id: string;
	matchNumber: number;
	blue1?: StandFormI;
	blue2?: StandFormI;
	blue3?: StandFormI;
	red1?: StandFormI;
	red2?: StandFormI;
	red3?: StandFormI;
};
