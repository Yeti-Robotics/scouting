import { PipelineStage } from 'mongoose';

export const sprDataAggregation: PipelineStage[] = [
	{
		$group: {
			_id: {
				eventID: '$eventID',
				matchNumber: '$matchNumber',
				alliance: '$alliance',
			},
			scoutScores: {
				$push: {
					scoutID: '$scouter',
					teamScouted: '$teamNumber',
					scoutscore: '$scoutScore',
				},
			},
		},
	},
];
