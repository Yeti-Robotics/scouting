import { PipelineStage } from 'mongoose';
import { StandFormI } from '../StandForm';

export const withNameAggregation: PipelineStage[] = [
	{
		$lookup: {
			from: 'teams',
			localField: 'teamNumber',
			foreignField: 'team_number',
			as: 'team',
		},
	},
	{
		$replaceRoot: {
			newRoot: {
				$mergeObjects: [
					{
						$arrayElemAt: ['$team', 0],
					},
					'$$ROOT',
				],
			},
		},
	},
	{
		$addFields: {
			teamName: '$team_name',
		},
	},
	{
		$project: {
			team: 0,
			team_number: 0,
			team_name: 0,
		},
	},
];

export interface StandFormWithName extends StandFormI {
	teamName: string;
}
