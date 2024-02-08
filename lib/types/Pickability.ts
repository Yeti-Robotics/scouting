export interface PickabilityWeightsI {
	autoAmpNotes: number;
	autoSpeakerNotes: number;
	teleopAmpNotes: number;
	teleopSpeakerNotes: number;
	teleopAmplifiedSpeakerNotes: number;
	trapNotes: number;
	climbRate: number;
	defense: number;
}

export interface TeamAvgsI extends PickabilityWeightsI {
	_id: number;
	climbSuccess: number;
	forms: number;
}

export interface TeamDerivedStatsI extends TeamAvgsI {
	firstPickability: number;
	secondPickability: number;
}
