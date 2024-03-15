import { PipelineStage } from 'mongoose';

export interface PerMatchStandFormGroup {
	_id: {
		teamNumber: number;
		matchNumber: number;
	};
	autoAmpNotes: number;
	autoSpeakerNotes: number;
	autoNotesMissed: number;
	teleopAmpNotes: number;
	teleopSpeakerNotes: number;
	teleopAmplifiedSpeakerNotes: number;
	teleopNotesMissed: number;
	trapAttempts: number;
	trapNotes: number;
	defense: number;
	totalSpeakerNotes: number;
	totalAmpNotes: number;
	autoScore: number;
	teleopScore: number;
	epa: number;
	notes: string[];
}

export const getPerMatchAggregation = (teamNumber: number): PipelineStage[] => [
	{
		$match: {
			teamNumber: teamNumber,
		},
	},
	{
		$group: {
			_id: {
				teamNumber: '$teamNumber',
				matchNumber: '$matchNumber',
			},
			autoAmpNotes: {
				$avg: '$autoAmpNotes',
			},
			autoSpeakerNotes: {
				$avg: '$autoSpeakerNotes',
			},
			autoNotesMissed: {
				$avg: '$autoSpeakerNotes',
			},
			teleopAmpNotes: {
				$avg: '$teleopAmpNotes',
			},
			teleopSpeakerNotes: {
				$avg: '$teleopSpeakerNotes',
			},
			teleopAmplifiedSpeakerNotes: {
				$avg: '$teleopAmplifiedSpeakerNotes',
			},
			teleopNotesMissed: {
				$avg: '$teleopNotesMissed',
			},
			trapAttempts: {
				$avg: '$trapAttempts',
			},
			trapNotes: {
				$avg: '$trapNotes',
			},
			defense: {
				$avg: '$defense',
			},
			totalSpeakerNotes: {
				$avg: {
					$add: [
						'$autoSpeakerNotes',
						'$teleopSpeakerNotes',
						'$teleopAmplifiedSpeakerNotes',
					],
				},
			},
			totalAmpNotes: {
				$avg: {
					$add: ['$autoAmpNotes', '$teleopAmpNotes'],
				},
			},
			autoScore: {
				$avg: {
					$add: [
						{ $multiply: ['$autoAmpNotes', 2] },
						{ $multiply: ['$autoSpeakerNotes', 5] },
					],
				},
			},
			teleopScore: {
				$avg: {
					$add: [
						{ $multiply: ['$teleopAmpNotes', 1] },
						{ $multiply: ['$teleopSpeakerNotes', 2] },
						{ $multiply: ['$teleopAmplifiedSpeakerNotes', 5] },
					],
				},
			},
			epa: {
				$avg: '$scoutScore',
			},
			notes: {
				$push: '$notes',
			},
		},
	},
];
