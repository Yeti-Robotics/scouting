import { PipelineStage } from 'mongoose';

export const teamDataAggregation: PipelineStage[] = [
	{
		$addFields: {
			autoScore: {
				$add: [
					{
						$multiply: ['$autoTopCones', 6],
					},
					{
						$multiply: ['$autoTopCubes', 6],
					},
					{
						$multiply: ['$autoMidCones', 4],
					},
					{
						$multiply: ['$autoMidCubes', 4],
					},
					{
						$multiply: ['$autoLowCones', 3],
					},
					{
						$multiply: ['$autoLowCubes', 3],
					},
					{
						$cond: {
							if: '$autoEngaged',
							then: 12,
							else: {
								$cond: {
									if: '$autoDocked',
									then: 8,
									else: 0,
								},
							},
						},
					},
				],
			},
			didAutoBalance: {
				$and: ['$attemptedAutoBalance', '$autoEngaged'],
			},
			teleopScore: {
				$add: [
					{
						$multiply: ['$teleopTopCones', 5],
					},
					{
						$multiply: ['$teleopTopCubes', 5],
					},
					{
						$multiply: ['$teleopMidCones', 3],
					},
					{
						$multiply: ['$teleopMidCubes', 3],
					},
					{
						$multiply: ['$teleopLowCones', 2],
					},
					{
						$multiply: ['$teleopLowCubes', 2],
					},
				],
			},
			endScore: {
				$cond: {
					if: '$teleopEngaged',
					then: {
						$multiply: ['$numberOnCharger', 10],
					},
					else: {
						$cond: {
							if: '$teleopDocked',
							then: {
								$multiply: ['$numberOnCharger', 6],
							},
							else: 0,
						},
					},
				},
			},
		},
	},
	{
		$group: {
			_id: '$teamNumber',
			avgTopCones: {
				$avg: {
					$add: ['$teleopTopCones', '$autoTopCones'],
				},
			},
			avgMidCones: {
				$avg: {
					$add: ['$teleopMidCones', '$autoMidCones'],
				},
			},
			avgLowCones: {
				$avg: {
					$add: ['$teleopLowCones', '$autoLowCones'],
				},
			},
			avgTopCubes: {
				$avg: {
					$add: ['$teleopTopCubes', '$autoTopCubes'],
				},
			},
			avgMidCubes: {
				$avg: {
					$add: ['$teleopMidCubes', '$autoMidCubes'],
				},
			},
			avgLowCubes: {
				$avg: {
					$add: ['$teleopLowCubes', '$autoLowCubes'],
				},
			},
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
			autoScore: {
				$avg: '$autoScore',
			},
			teleopScore: {
				$avg: '$teleopScore',
			},
			avgEndScore: {
				$avg: '$endScore',
			},
			avgPenalties: {
				$avg: '$penalties',
			},
			avgDefense: {
				$avg: '$defense',
			},
			autoDockPercent: {
				$avg: {
					$cond: [
						'$attemptedAutoBalance',
						{
							$cond: [
								{
									$and: [
										'$autoDocked',
										{
											$not: '$autoEngaged',
										},
									],
								},
								100,
								0,
							],
						},
						null,
					],
				},
			},
			autoEngagePercent: {
				$avg: {
					$cond: [
						'$attemptedAutoBalance',
						{
							$cond: ['$autoEngaged', 100, 0],
						},
						null,
					],
				},
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
			initiationLine: {
				$round: ['$initiationLine', 1],
			},
			autoEngagePercent: {
				$round: ['$autoEngagePercent', 2],
			},
			autoDockPercent: {
				$round: ['$autoDockPercent', 2],
			},
			avgTopCones: 1,
			avgMidCones: 1,
			avgLowCones: 1,
			avgTopCubes: 1,
			avgMidCubes: 1,
			avgLowCubes: 1,
			avgPenalties: 1,
			avgDefense: 1,
			avgEndScore: {
				$round: ['$avgEndScore', 1],
			},
			avgAutoScore: {
				$round: ['$autoScore', 1],
			},
			avgTeleopScore: {
				$round: ['$teleopScore', 1],
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
	avgAutoScore: number;
	avgTeleopScore: number;
	avgEndScore: number;
	avgPenalties: number;
	avgDefense: number;
	initiationLine: number;
	avgTopCones: number;
	avgMidCones: number;
	avgLowCones: number;
	avgTopCubes: number;
	avgMidCubes: number;
	avgLowCubes: number;
	autoDockPercent: number;
	autoEngagePercent: number;
}

export interface RawTeamData extends Omit<TeamData, 'endPosition' | 'bestEndPosition'> {
	endPosition: number[];
}
