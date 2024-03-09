import { PipelineStage } from 'mongoose';

export const teamDataAggregation: PipelineStage[] = [
	{
		$addFields: {
			autoScore: {
				$add: [
					{
						$multiply: ['$autoSpeakerNotes', 5],
					},
					{ $multiply: ['$autoAmpNotes', 2] },
					{ $cond: ['$initiationLine', 2, 0] },
				],
			},
			teleopScore: {
				$add: [
					{ $multiply: ['$teleopAmpNotes', 1] },
					{
						$multiply: ['$teleopSpeakerNotes', 2],
					},
					{
						$multiply: ['$teleopAmplifiedSpeakerNotes', 5],
					},
				],
			},
			endgameScore: {
				$add: [
					{
						$cond: {
							if: '$climb',
							then: {
								$add: [
									3,
									{
										$cond: ['$spotlight', 1, 0],
									},
									{
										$divide: [
											{
												$multiply: [
													2,
													{
														$subtract: ['$numberOnChain', 1],
													},
												],
											},
											{ $max: [1, '$numberOnChain'] },
										],
									},
								],
							},
							else: 0,
						},
					},
					{ $multiply: ['$trapNotes', 5] },
					{ $cond: ['$park', 1, 0] },
				],
			},
		},
	},
	{
		$group: {
			_id: {
				teamNumber: '$teamNumber',
				matchNumber: '$matchNumber',
			},
			avgTeleopAmpNotes: {
				$avg: '$teleopAmpNotes',
			},
			avgTeleopSpeakerNotes: {
				$avg: {
					$add: ['$teleopSpeakerNotes', '$teleopAmplifiedSpeakerNotes'],
				},
			},
			avgTeleopAmplifiedSpeakerNotes: {
				$avg: '$teleopAmplifiedSpeakerNotes',
			},
			avgAutoAmpNotes: {
				$avg: '$autoAmpNotes',
			},
			avgAutoSpeakerNotes: {
				$avg: '$autoSpeakerNotes',
			},
			avgAmpNotes: {
				$avg: {
					$add: ['$teleopAmpNotes', '$autoAmpNotes'],
				},
			},
			avgSpeakerNotes: {
				$avg: {
					$add: [
						'$teleopSpeakerNotes',
						'$teleopAmplifiedSpeakerNotes',
						'$autoSpeakerNotes',
					],
				},
			},
			avgNotesMissed: {
				$avg: {
					$add: ['$teleopNotesMissed', '$autoNotesMissed'],
				},
			},
			initiationLine: {
				$avg: {
					$cond: ['$initiationLine', 1, 0],
				},
			},
			autoScore: { $avg: '$autoScore' },
			teleopScore: { $avg: '$teleopScore' },
			avgEndScore: { $avg: '$endgameScore' },
			avgDefense: {
				$avg: {
					$cond: [{ $ne: ['$defense', 0] }, '$defense', null],
				},
			},
			avgPointsAdded: { $avg: '$scoutScore' },
		},
	},
	{
		$group: {
			_id: { teamNumber: '$_id.teamNumber' },
			avgTeleopAmpNotes: {
				$avg: '$avgTeleopAmpNotes',
			},
			avgTeleopSpeakerNotes: {
				$avg: '$avgTeleopSpeakerNotes',
			},
			avgTeleopAmplifiedSpeakerNotes: {
				$avg: '$avgTeleopAmplifiedSpeakerNotes',
			},
			avgAutoAmpNotes: {
				$avg: '$avgAutoAmpNotes',
			},
			avgAutoSpeakerNotes: {
				$avg: '$avgAutoSpeakerNotes',
			},
			avgAmpNotes: { $avg: '$avgAmpNotes' },
			avgSpeakerNotes: {
				$avg: '$avgSpeakerNotes',
			},
			avgNotesMissed: {
				$avg: '$avgNotesMissed',
			},
			initiationLine: {
				$avg: '$initiationLine',
			},
			autoScore: { $avg: '$autoScore' },
			teleopScore: { $avg: '$teleopScore' },
			avgEndScore: { $avg: '$avgEndScore' },
			avgDefense: { $avg: '$avgDefense' },
			epa: { $avg: '$avgPointsAdded' },
			epaDev: {
				$stdDevSamp: '$avgPointsAdded',
			},
			stdAutoScore: {
				$stdDevSamp: '$autoScore',
			},
		},
	},
	{
		$project: {
			_id: 1,
			initiationLine: {
				$round: ['$initiationLine', 3],
			},
			avgTeleopAmpNotes: {
				$round: ['$avgTeleopAmpNotes', 3],
			},
			avgTeleopSpeakerNotes: {
				$round: ['$avgTeleopSpeakerNotes', 3],
			},
			avgTeleopAmplifiedSpeakerNotes: {
				$round: ['$avgTeleopAmplifiedSpeakerNotes', 3],
			},
			avgAutoAmpNotes: {
				$round: ['$avgAutoAmpNotes', 3],
			},
			avgAutoSpeakerNotes: {
				$round: ['$avgAutoSpeakerNotes', 3],
			},
			avgAmpNotes: {
				$round: ['$avgAmpNotes', 3],
			},
			avgSpeakerNotes: {
				$round: ['$avgSpeakerNotes', 3],
			},
			avgNotesMissed: {
				$round: ['$avgNotesMissed', 3],
			},
			avgDefense: {
				$round: ['$avgDefense', 3],
			},
			avgEndScore: {
				$round: ['$avgEndScore', 3],
			},
			avgAutoScore: {
				$round: ['$autoScore', 3],
			},
			avgTeleopScore: {
				$round: ['$teleopScore', 3],
			},
			epa: { $round: ['$epa', 3] },
			epaDev: { $round: ['$epaDev', 3] },
			stdAutoScore: {
				$round: ['$stdAutoScore', 3],
			},
		},
	},
	{
		$addFields: {
			teamNumber: '$_id.teamNumber',
			epaConsistency: {
				$cond: [
					{ $gt: ['$epa', 0] },
					{ $round: [{ $divide: ['$epaDev', { $max: ['$epa', 1] }] }, 3] },
					null,
				],
			},
			teleopSpeakerAmplifiedRatio: {
				$round: [
					{
						$divide: [
							'$avgTeleopAmplifiedSpeakerNotes',
							{
								$max: ['$avgTeleopSpeakerNotes', 1],
							},
						],
					},
					3,
				],
			},
			WPA: {
				$round: [
					{
						$min: [
							{
								$multiply: [1.41, '$epa'],
							},
							100,
						],
					},
					3,
				],
			},
			autoWPA: {
				$round: [
					{
						$min: [
							{
								$multiply: [1.95, '$avgAutoScore'],
							},
							100,
						],
					},
					3,
				],
			},
			autoConsistency: {
				$cond: [
					{ $gt: ['$avgAutoScore', 0] },
					{ $divide: ['$stdAutoScore', { $max: ['$avgAutoScore', 1] }] },
					null,
				],
			},
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
				$mergeObjects: [{ $arrayElemAt: ['$team', 0] }, '$$ROOT'],
			},
		},
	},
	{ $addFields: { teamName: '$team_name' } },
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
	avgDefense: number | null;
	initiationLine: number;
	avgTeleopAmpNotes: number;
	avgTeleopSpeakerNotes: number;
	avgTeleopAmplifiedSpeakerNotes: number;
	avgAutoSpeakerNotes: number;
	avgAutoAmpNotes: number;
	avgAmpNotes: number;
	avgSpeakerNotes: number;
	avgNotesMissed: number;
	epa: number;
	epaDev: number | null;
	epaConsistency: number | null;
	teleopSpeakerAmplifiedRatio: number | null;
	WPA: number;
	autoWPA: number;
	autoConsistency: number | null;
	stdAutoScore: number | null;
}

export interface RawTeamData extends Omit<TeamData, 'endPosition' | 'bestEndPosition'> {
	endPosition: number[];
}
