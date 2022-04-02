import { PipelineStage } from 'mongoose';

export const teamDataAggregation: PipelineStage[] = [
	// {
	// 	$match: {
	// 		approved: true,
	// 	},
	// },
	{
		$addFields: {
			autoTotalUpperBalls: {
				$add: ['$autoUpperBallsScored', '$autoUpperBallsMissed'],
			},
			autoTotalLowerBalls: {
				$add: ['$autoLowBallsScored', '$autoLowBallsMissed'],
			},
			teleopTotalLowerBalls: {
				$add: ['$teleopLowBallsScored', '$teleopLowBallsMissed'],
			},
			teleopTotalUpperBalls: {
				$add: ['$teleopUpperBallsScored', '$teleopUpperBallsMissed'],
			},
			autoScore: {
				$add: [
					{
						$multiply: ['$autoUpperBallsScored', 4],
					},
					{
						$multiply: ['$autoLowBallsScored', 2],
					},
				],
			},
			teleopScore: {
				$add: [
					{
						$multiply: ['$teleopUpperBallsScored', 2],
					},
					{
						$multiply: ['$teleopLowBallsScored', 1],
					},
				],
			},
		},
	},
	{
		$addFields: {
			avgUpperAuto: {
				$cond: [
					{
						$eq: ['$autoTotalUpperBalls', 0],
					},
					0,
					{
						$divide: ['$autoUpperBallsScored', '$autoTotalUpperBalls'],
					},
				],
			},
			avgLowerAuto: {
				$cond: [
					{
						$eq: ['$autoTotalLowerBalls', 0],
					},
					0,
					{
						$divide: ['$autoLowBallsScored', '$autoTotalLowerBalls'],
					},
				],
			},
			avgUpperTeleop: {
				$cond: [
					{
						$eq: ['$teleopTotalUpperBalls', 0],
					},
					0,
					{
						$divide: ['$teleopUpperBallsScored', '$teleopTotalUpperBalls'],
					},
				],
			},
			avgLowerTeleop: {
				$cond: [
					{
						$eq: ['$teleopTotalLowerBalls', 0],
					},
					0,
					{
						$divide: ['$teleopLowBallsScored', '$teleopTotalLowerBalls'],
					},
				],
			},
		},
	},
	{
		$group: {
			_id: '$teamNumber',
			initiationLine: {
				$avg: {
					$multiply: [
						{
							$convert: {
								input: '$initiationLine',
								to: 'int',
							},
						},
						100,
					],
				},
			},
			avgUpperAuto: {
				$avg: {
					$multiply: ['$avgUpperAuto', 100],
				},
			},
			avgLowerAuto: {
				$avg: {
					$multiply: ['$avgLowerAuto', 100],
				},
			},
			avgUpperTeleop: {
				$avg: {
					$multiply: ['$avgUpperTeleop', 100],
				},
			},
			avgLowerTeleop: {
				$avg: {
					$multiply: ['$avgLowerTeleop', 100],
				},
			},
			endPosition: {
				$push: '$endPosition',
			},
			autoScore: {
				$avg: '$autoScore',
			},
			teleopScore: {
				$avg: '$teleopScore',
			},
			avgUpperBallsScored: {
				$avg: '$teleopUpperBallsScored',
			},
			avgLowBallsScored: {
				$avg: '$teleopLowBallsScored',
			},
			avgPenalties: {
				$avg: '$penalties',
			},
			avgDefense: {
				$avg: '$defense',
			},
			teleopUpperBallsScoredArr: {
				$push: '$teleopUpperBallsScored',
			},
			teleopLowBallsScoredArr: {
				$push: '$teleopLowBallsScored',
			},
			autoUpperBallsScoredArr: {
				$push: '$autoUpperBallsScored',
			},
			autoLowBallsScoredArr: {
				$push: '$autoLowBallsScored',
			},
		},
	},
	{
		$sort: {
			_id: 1,
		},
	},
	{
		$project: {
			_id: 1,
			positionControl: 1,
			endPosition: 1,
			avgUpperAuto: 1,
			avgLowerAuto: 1,
			avgUpperTeleop: 1,
			avgLowerTeleop: 1,
			avgPenalties: 1,
			avgDefense: 1,
			upperBallsScored: 1,
			lowBallsScored: 1,
			avgUpperBallsScored: 1,
			avgLowBallsScored: 1,
			avgAutoScore: {
				$round: ['$autoScore', 1],
			},
			avgTeleopScore: {
				$round: ['$teleopScore', 1],
			},
			teleopUpperBallsScored: {
				$reduce: {
					input: '$teleopUpperBallsScoredArr',
					initialValue: 0,
					in: {
						$add: ['$$value', '$$this'],
					},
				},
			},
			teleopLowBallsScored: {
				$reduce: {
					input: '$teleopLowBallsScoredArr',
					initialValue: 0,
					in: {
						$add: ['$$value', '$$this'],
					},
				},
			},
			autoUpperBallsScored: {
				$reduce: {
					input: '$autoUpperBallsScoredArr',
					initialValue: 0,
					in: {
						$add: ['$$value', '$$this'],
					},
				},
			},
			autoLowBallsScored: {
				$reduce: {
					input: '$autoLowBallsScoredArr',
					initialValue: 0,
					in: {
						$add: ['$$value', '$$this'],
					},
				},
			},
		},
	},
	{
		$addFields: {
			upperBallsScored: {
				$add: ['$teleopUpperBallsScored', '$autoUpperBallsScored'],
			},
			lowBallsScored: {
				$add: ['$teleopLowBallsScored', '$autoLowBallsScored'],
			},
		},
	},
	{
		$addFields: {
			teamNumber: '$_id',
		},
	},
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
			_id: 0,
			team: 0,
			team_number: 0,
			team_name: 0,
		},
	},
];

export interface TeamData {
	teamName: string;
	teamNumber: number;
	avgUpperBallsScored: number;
	avgLowBallsScored: number;
	avgTeleopScore: number;
	avgAutoScore: number;
	avgUpperAuto: number;
	avgLowerAuto: number;
	avgUpperTeleop: number;
	avgLowerTeleop: number;
	avgPenalties: number;
	avgDefense: number;
	endPosition: number;
	bestEndPosition: number;
	upperBallsScored: number;
	lowBallsScored: number;
}

export interface RawTeamData extends Omit<TeamData, 'endPosition' | 'bestEndPosition'> {
	endPosition: number[];
}
