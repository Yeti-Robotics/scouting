type AutoLine = 'Yes' | 'No';
type EndgameStatus = 'None' | 'Parked' | 'StageRight' | 'StageLeft' | 'CenterStage';

interface AllianceScoreBreakdown {
	adjustPoints: number;
	autoAmpNoteCount: number;
	autoAmpNotePoints: number;
	autoLeavePoints: number;
	autoLineRobot1: AutoLine;
	autoLineRobot2: AutoLine;
	autoLineRobot3: AutoLine;
	autoPoints: number;
	autoSpeakerNoteCount: number;
	autoSpeakerNotePoints: number;
	autoTotalNotePoints: number;
	coopNotePlayed: boolean;
	coopertitionBonusAchieved: boolean;
	coopertitionCriteriaMet: boolean;
	endGameHarmonyPoints: number;
	endGameNoteInTrapPoints: number;
	endGameOnStagePoints: number;
	endGameParkPoints: number;
	endGameRobot1: EndgameStatus;
	endGameRobot2: EndgameStatus;
	endGameRobot3: EndgameStatus;
	endGameSpotLightBonusPoints: number;
	endGameTotalStagePoints: number;
	ensembleBonusAchieved: boolean;
	ensembleBonusOnStageRobotsThreshold: number;
	ensembleBonusStagePointsThreshold: number;
	foulCount: number;
	foulPoints: number;
	g206Penalty: boolean;
	g408Penalty: boolean;
	g424Penalty: boolean;
	melodyBonusAchieved: boolean;
	melodyBonusThreshold: number;
	melodyBonusThresholdCoop: number;
	melodyBonusThresholdNonCoop: number;
	micCenterStage: boolean;
	micStageLeft: boolean;
	micStageRight: boolean;
	rp: number;
	techFoulCount: number;
	teleopAmpNoteCount: number;
	teleopAmpNotePoints: number;
	teleopPoints: number;
	teleopSpeakerNoteAmplifiedCount: number;
	teleopSpeakerNoteAmplifiedPoints: number;
	teleopSpeakerNoteCount: number;
	teleopSpeakerNotePoints: number;
	teleopTotalNotePoints: number;
	totalPoints: number;
	trapCenterStage: boolean;
	trapStageLeft: boolean;
	trapStageRight: boolean;
}

export default interface ScoreBreakdown {
	blue: AllianceScoreBreakdown;
	red: AllianceScoreBreakdown;
}
