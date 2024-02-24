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
