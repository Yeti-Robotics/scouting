import { CreateStandForm } from '@/models/StandForm';

export const defaultValues: Partial<CreateStandForm> = {
	autoSpeakerNotes: 0,
	autoAmpNotes: 0,
	autoNotesMissed: 0,
	teleopAmpNotes: 0,
	teleopSpeakerNotes: 0,
	teleopAmplifiedSpeakerNotes: 0,
	teleopNotesMissed: 0,
	numberOnChain: 1,
	penalties: 0,
	trapAttempts: 0,
	trapNotes: 0,
	scoutScore: 0,
	eventID: '2024ncwak',
};
