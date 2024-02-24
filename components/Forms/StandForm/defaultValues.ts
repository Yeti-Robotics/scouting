import { CreateStandForm } from '@/models/StandForm';

export const defaultValues: Partial<CreateStandForm> = {
	autoAmpNotes: 0,
	autoSpeakerNotes: 0,
	autoNotesMissed: 0,
	climb: false,
	initiationLine: false,
	matchNumber: undefined,
	notes: '',
	numberOnChain: 0,
	preload: true,
	spotlight: false,
	park: false,
	teleopAmpNotes: 0,
	teleopSpeakerNotes: 0,
	teleopAmplifiedSpeakerNotes: 0,
	teleopNotesMissed: 0,
	trapAttempts: 0,
	trapNotes: 0,
	penalties: 0,
	defense: -1,
};
