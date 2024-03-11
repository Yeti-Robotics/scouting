import { TBATeamKey } from '@/lib/types/tba/utilTypes';
import { StandFormI } from '@/models/StandForm';
import { PipelineStage } from 'mongoose';

export interface AllianceReportedTotals {
	matchNumber: number;
	alliance: 'red' | 'blue';
	autoAmpNotes: number;
	autoSpeakerNotes: number;
	teleopAmpNotes: number;
	teleopSpeakerNotes: number;
	teleopAmplifiedSpeakerNotes: number;
	trapNotes: number;
	teamsReceived: number;
	formsReceived: number;
}

// Get average of all reported fields on TBA, for use in verifying reported totals match the totals
// on TBA
export const allianceReportedTotals: PipelineStage[] = [
	// Group by team number first to get average of all fields across forms for each team
	{
		$group: {
			_id: {
				teamNumber: '$teamNumber',
				matchNumber: '$matchNumber',
			},
			autoAmpNotes: { $avg: '$autoAmpNotes' },
			autoSpeakerNotes: {
				$avg: '$autoSpeakerNotes',
			},
			alliance: { $first: '$alliance' },
			teleopAmpNotes: {
				$avg: '$teleopAmpNotes',
			},
			teleopAmplifiedSpeakerNotes: {
				$avg: '$teleopAmplifiedSpeakerNotes',
			},
			trapNotes: { $avg: '$trapNotes' },
			formsReceived: { $count: {} },
		},
	},
	// Group by match number and alliance to get alliance totals
	{
		$group: {
			_id: {
				matchNumber: '$_id.matchNumber',
				alliance: '$alliance',
			},
			autoAmpNotes: { $sum: '$autoAmpNotes' },
			autoSpeakerNotes: {
				$sum: '$autoSpeakerNotes',
			},
			teleopAmpNotes: {
				$sum: '$teleopAmpNotes',
			},
			teleopSpeakerNotes: {
				$sum: '$teleopSpeakerNotes',
			},
			teleopAmplifiedSpeakerNotes: {
				$sum: '$teleopAmplifiedSpeakerNotes',
			},
			trapNotes: { $sum: '$trapNotes' },
			teamsReceived: { $count: {} },
			formsReceived: { $sum: '$formsReceived' },
		},
	},
	{
		$addFields: {
			matchNumber: '$_id.matchNumber',
			alliance: '$_id.alliance',
		},
	},
	{ $unset: '_id' },
];

export interface TeamStandFormsByMatch {
	teamKey: TBATeamKey;
	matchNumber: number;
	alliance: 'red' | 'blue';
	forms: StandFormI[];
}

// Aggregate forms by match and team for use in verifying stand forms equal each other and match
// TBA reported initiation line and endgame totals
export const teamStandFormsByMatch: PipelineStage[] = [
	{
		$group: {
			_id: {
				matchNumber: '$matchNumber',
				teamNumber: '$teamNumber',
			},
			alliance: { $first: '$alliance' },
			forms: {
				$push: '$$ROOT',
			},
		},
	},
	{
		$addFields: {
			matchNumber: '$_id.matchNumber',
			teamKey: {
				$concat: ['frc', { $toString: '$_id.teamNumber' }],
			},
		},
	},
	{ $unset: '_id' },
];
