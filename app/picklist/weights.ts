/**
 * Contains weights for pickability
 *
 * @todo fine tune weights post week1 competitions
 */

// First pickability -- weight speaker heavier
export const firstPickWeights = {
	autoAmpNotes: 1.5,
	autoSpeakerNotes: 3,
	teleopAmpNotes: 2.5,
	teleopSpeakerNotes: 5.5,
	teleopAmplifiedSpeakerNotes: 1,
	trapNotes: 1,
	climbRate: 1.5,
	defense: 0,
};

// Second pickability -- weight amp heavier
export const secondPickWeights = {
	autoAmpNotes: 2.5,
	autoSpeakerNotes: 1,
	teleopAmpNotes: 3,
	teleopSpeakerNotes: 1.5,
	teleopAmplifiedSpeakerNotes: 0.5,
	trapNotes: 0.5,
	climbRate: 3,
	defense: 3,
};
