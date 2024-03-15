import { StandFormI } from '@/models/StandForm';
import { AllianceReportedTotals, TeamStandFormsByMatch } from './aggregations';
import { AllianceScoreBreakdown, EndgameStatus } from '@/lib/types/tba/score-breakdown';
import TBAMatch from '@/lib/types/tba/match';
import { TBATeamKey } from '@/lib/types/tba/utilTypes';

const keysToCompare: (keyof StandFormI)[] = [
	'autoAmpNotes',
	'autoSpeakerNotes',
	'autoNotesMissed',
	'teleopAmpNotes',
	'teleopSpeakerNotes',
	'teleopAmplifiedSpeakerNotes',
	'teleopNotesMissed',
	'shuttleNotes',
	'trapNotes',
	'trapAttempts',
	'numberOnChain',
];

export function verifyFormEquality(reference: StandFormI, comparison: StandFormI) {
	// Check if the scout score is the same, if it's not we know right off the bat the forms are not equal
	if (reference.scoutScore !== comparison.scoutScore) return false;
	// Handle case where the scout score is the same, but the forms are not equal
	for (let key of keysToCompare) {
		if (reference[key] !== comparison[key]) {
			return false;
		}
	}
	// If all fields are the same, return true
	return true;
}

const keyPairings: [keyof AllianceScoreBreakdown, MismatchedField][] = [
	['autoAmpNoteCount', 'autoAmpNotes'],
	['autoSpeakerNoteCount', 'autoSpeakerNotes'],
	['teleopAmpNoteCount', 'teleopAmpNotes'],
	['teleopSpeakerNoteCount', 'teleopSpeakerNotes'],
	['teleopSpeakerNoteAmplifiedCount', 'teleopAmplifiedSpeakerNotes'],
];

export type MatchNumberToMatch = {
	[k: string]: TBAMatch;
};

function compareAllianceTotals(
	tbaReported: AllianceScoreBreakdown,
	scoutReported: AllianceReportedTotals,
) {
	const mismatchedKeys: MismatchedField[] = [];
	for (let [tbaKey, scoutKey] of keyPairings) {
		if (tbaReported[tbaKey] !== scoutReported[scoutKey]) {
			mismatchedKeys.push(scoutKey);
		}
	}
	const tbaTrapNotes =
		+tbaReported.trapCenterStage + +tbaReported.trapStageLeft + +tbaReported.trapStageRight;
	if (tbaTrapNotes !== scoutReported.trapNotes) mismatchedKeys.push('trapNotes');
	return mismatchedKeys;
}

interface AllianceReportedError {
	matchNumber: number;
	alliance: 'red' | 'blue';
}

type MismatchedField = keyof Omit<
	AllianceReportedTotals,
	'matchNumber' | 'teamsReceived' | 'formsReceived' | 'alliance'
>;

interface MismatchedFields extends AllianceReportedError {
	mismatchedFields: MismatchedField[];
}

export function findAllianceErrors(
	matchNumberToMatch: MatchNumberToMatch,
	allianceReportedTotals: AllianceReportedTotals[],
) {
	const alliancesMissingTeams: AllianceReportedError[] = [];
	const alliancesWithMismatchedFields: MismatchedFields[] = [];
	for (let alliance of allianceReportedTotals) {
		if (alliance.teamsReceived !== 3) {
			alliancesMissingTeams.push({
				matchNumber: alliance.matchNumber,
				alliance: alliance.alliance,
			});
			continue;
		}
		const allianceColor = alliance.alliance;
		const tbaAllianceScoreBreakdown =
			matchNumberToMatch[alliance.matchNumber]?.score_breakdown?.[allianceColor];
		if (!tbaAllianceScoreBreakdown) continue; // Skip if the match score not posted yet
		const mismatchedKeys = compareAllianceTotals(tbaAllianceScoreBreakdown, alliance);
		if (mismatchedKeys.length > 0)
			alliancesWithMismatchedFields.push({
				matchNumber: alliance.matchNumber,
				alliance: allianceColor,
				mismatchedFields: mismatchedKeys,
			});
	}
	return { alliancesWithMismatchedFields, alliancesMissingTeams };
}

interface MismatchedForms {
	matchNumber: number;
	teamNumber: number;
	idForm1: string;
	idForm2: string;
}

export function findFormsNotMatching(forms: TeamStandFormsByMatch[]): MismatchedForms[] {
	const formsNotMatching: MismatchedForms[] = [];
	for (let teamMatchStandForms of forms) {
		const reference = teamMatchStandForms.forms[0];
		for (let i = 1; i < teamMatchStandForms.forms.length; i++) {
			const comparison = teamMatchStandForms.forms[i];
			if (!verifyFormEquality(reference, comparison)) {
				formsNotMatching.push({
					matchNumber: teamMatchStandForms.matchNumber,
					teamNumber: parseInt(teamMatchStandForms.teamKey.slice(3)),
					idForm1: reference._id,
					idForm2: comparison._id,
				});
			}
		}
	}
	return formsNotMatching;
}

function getTeamPosition(
	teamKey: TBATeamKey,
	alliance: 'red' | 'blue',
	match: TBAMatch,
): 1 | 2 | 3 {
	const teamKeys = match.alliances[alliance].team_keys;
	return (teamKeys.indexOf(teamKey) + 1) as 1 | 2 | 3;
}

type IndividualFormErrorName = 'autoLine' | 'endgameStatus';
interface IndividualFormError {
	matchNumber: number;
	teamNumber: number;
	errors: IndividualFormErrorName[];
	_id: string;
}

function didClimbCorrectly(climb: boolean, park: boolean, tbaStatus: EndgameStatus) {
	if (climb && ['StageRight', 'StageLeft', 'CenterStage'].includes(tbaStatus)) return true;
	if (park && tbaStatus === 'Parked') return true;
	if (!climb && !park && tbaStatus === 'None') return true;
	return false;
}

export function findIndividualFormErrors(
	forms: TeamStandFormsByMatch[],
	matchNumberToMatch: MatchNumberToMatch,
) {
	const formErrors: IndividualFormError[] = [];
	for (let groupedStandForm of forms) {
		const allianceScoreBreakdown =
			matchNumberToMatch[groupedStandForm.matchNumber]?.score_breakdown?.[
				groupedStandForm.alliance
			];
		if (!allianceScoreBreakdown) continue; // Skip if the match score not posted yet
		const teamPosition = getTeamPosition(
			groupedStandForm.teamKey,
			groupedStandForm.alliance,
			matchNumberToMatch[groupedStandForm.matchNumber],
		);
		const autoLineKey = `autoLineRobot${teamPosition}` as
			| 'autoLineRobot1'
			| 'autoLineRobot2'
			| 'autoLineRobot3';
		const endGameRobotKey = `endGameRobot${teamPosition}` as
			| 'endGameRobot1'
			| 'endGameRobot2'
			| 'endGameRobot3';
		for (let form of groupedStandForm.forms) {
			const errors: IndividualFormErrorName[] = [];
			if (
				(form.initiationLine && allianceScoreBreakdown[autoLineKey] === 'No') ||
				(!form.initiationLine && allianceScoreBreakdown[autoLineKey] === 'Yes')
			) {
				errors.push('autoLine');
			}
			if (
				!didClimbCorrectly(form.climb, form.park, allianceScoreBreakdown[endGameRobotKey])
			) {
				errors.push('endgameStatus');
			}
			if (errors.length > 0)
				formErrors.push({
					matchNumber: groupedStandForm.matchNumber,
					teamNumber: parseInt(groupedStandForm.teamKey.slice(3)),
					errors,
					_id: form._id,
				});
		}
	}
	return formErrors;
}
