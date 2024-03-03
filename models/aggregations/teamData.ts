import { PipelineStage } from 'mongoose';

export const teamDataAggregation: PipelineStage[] = [
	{
		$addFields: {
			autoScore: {
				$add: [
					{
						$multiply: ['$autoSpeakerNotes', 5],
					},
					{
						$multiply: ['$autoAmpNotes', 2],
					},
				],
			},
			teleopScore: {
				$add: [
					{
						$multiply: ['$teleopAmpNotes', 1],
					},
					{
						$multiply: ['$teleopSpeakerNotes', 2],
					},
					{
						$multiply: ['$teleopAmplifiedSpeakerNotes', 5],
					},
				],
			},
			endScore: {
				$add: [
					{
						$cond: {
							if: '$climb',
							then: {
								$add: [
									{
										$cond: ['$spotlight', 4, 3],
									},
									{
										$multiply: [{ $subtract: ['$numberOnChain', 1] }, 2],
									},
								],
							},
							else: 0,
						},
					},
					{
						$multiply: ['$trapNotes', 5],
					},
				],
			},
		},
	},
	{
		$group: {
			_id: '$teamNumber',
			avgTeleopAmpNotes: {
				$avg: '$teleopAmpNotes',
			},
			avgTeleopSpeakerNotes: {
				$avg: {
					$add: ['$teleopSpeakerNotes', '$teleopAmplifiedSpeakerNotes'],
				},
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
				$avg: {
					$cond: [
						{
							$ne: ['$defense', 0],
						},
						'$defense',
						null,
					],
				},
			},
			epa: {
				$avg: '$scoutScore',
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
			avgTeleopAmpNotes: 1,
			avgTeleopSpeakerNotes: 1,
			avgTeleopAmplifiedSpeakerNotes: 1,
			avgAutoAmpNotes: 1,
			avgAutoSpeakerNotes: 1,
			avgAmpNotes: 1,
			avgSpeakerNotes: 1,
			avgNotesMissed: 1,
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
			epa: {
				$round: ['$epa', 1],
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
}

export interface RawTeamData extends Omit<TeamData, 'endPosition' | 'bestEndPosition'> {
	endPosition: number[];
}
