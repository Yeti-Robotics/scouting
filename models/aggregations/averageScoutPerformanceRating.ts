import { PipelineStage } from 'mongoose';

/**
 * Represents a scout score.
 */
export interface ScoutScore {
	scoutId: string;
	teamScouted: number;
	scoutScore: number;
}

/**
 * Represents the data structure for SPR (Scout Performance Report) aggregation.
 */
export interface AllianceScoutScores {
	_id: {
		matchNumber: number;
		alliance: 'blue' | 'red';
	};
	scoutScores: ScoutScore[];
}

/**
 * Aggregates StandForm data to retrieve a list of scout scores for each alliance.
 */
export const allianceScoutScoresAggregation: PipelineStage[] = [
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
