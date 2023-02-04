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
						$multiply: ['$numOnCharger', 10],
					},
					else: {
						$cond: {
							if: '$teleopDocked',
							then: {
								$multiply: ['$numOnCharger', 6],
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
}

export interface RawTeamData extends Omit<TeamData, 'endPosition' | 'bestEndPosition'> {
	endPosition: number[];
}
