import { CreateStandForm } from '@/models/StandForm';

export const defaultValues: Partial<CreateStandForm> = {
	autoSpeakerNotes: 0,
	autoAmpNotes: 0,
	teleopAmpNotes: 0,
	teleopSpeakerNotes: 0,
	teleopAmplifiedSpeakerNotes: 0,
	trapNotes: 0,
	numberOnChain: 0,
	penalties: 0,
};
