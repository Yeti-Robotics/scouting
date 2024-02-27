import { PipelineStage } from 'mongoose';

export const sprDataAggregation: PipelineStage[] = [
	{
		$group: {
			_id: {
				matchNumber: '$matchNumber',
				alliance: '$alliance',
			},
			scoutScores: {
				$push: {
					scoutID: '$scouter',
					teamScouted: '$teamNumber',
					scoutScore: '$scoutScore',
				},
			},
		},
	},
];

export interface ScoutScore {
	scoutId: string;
	teamScouted: number;
	scoutScore: number;
}

export interface AggregationSPRDataI {
	_id: {
		matchNumber: number;
		alliance: 'blue' | 'red';
	};
	scoutScores: ScoutScore[];
}
