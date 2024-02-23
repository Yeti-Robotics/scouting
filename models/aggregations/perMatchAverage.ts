import { PipelineStage } from 'mongoose';

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
		},
	},
];
