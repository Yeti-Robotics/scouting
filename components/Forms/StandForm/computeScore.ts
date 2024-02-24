import { CreateStandForm } from '@/models/StandForm';

//Object containing score values for various scoring options
const SCORES = {
	autoAmpNotes: 2,
	autoSpeakerNotes: 5,
	teleopAmpNotes: 1,
	teleopSpeakerNotes: 2,
	teleopAmplifiedSpeakerNotes: 5,
	trapNotes: 5,
	climb: 3,
};

/**
 * Computes scouter reported score for a robot (used in spr)
 * @param scouting form
 * @returns total score for that form
 */
export const computeScore = (form: CreateStandForm) => {
	const keys = Object.keys(SCORES) as Array<keyof typeof SCORES>;
	return keys.reduce((acc, key) => {
		if (key === 'climb') {
			return acc + computeEndgameScore(form);
		}
		return acc + SCORES[key] * form[key];
	}, 0);
};

/**
 * Computes endgame score
 * @param form scouting form
 * @returns approx. contribution to endgame score
 */
export const computeEndgameScore = (form: CreateStandForm) =>{
	const harmonyPoints = (2 * (form.numberOnChain - 1)) / form.numberOnChain;
	const spotlightBonus = form.spotlight ? 1 : 0;
	return SCORES.climb + harmonyPoints + spotlightBonus;
}
