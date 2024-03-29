/* eslint-disable @typescript-eslint/ban-types */
import { Subdocument } from '@/lib/api/types';
import { Model, model, models, Schema, Types } from 'mongoose';

type MatchModelType = Model<MatchI, {}>;

const storedAllianceSchema = new Schema<StoredTBAMtch>({
	teleopGrid: { B: [String], M: [String], T: [String] },
	autoGrid: { B: [String], M: [String], T: [String] },
	lowCubes: Number,
	lowCones: Number,
	midCubes: Number,
	midCones: Number,
	highCubes: Number,
	highCones: Number,
});
const matchSchema = new Schema<MatchI, MatchModelType>(
	{
		blue1: { type: Number },
		blue2: { type: Number },
		blue3: { type: Number },
		red1: { type: Number },
		red2: { type: Number },
		red3: { type: Number },
		winner: { type: String },
		topScorer: { type: Number },
		bottomScorer: { type: Number },
		open: { type: Boolean, required: true },
		startTime: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
		setNumber: { type: Number, required: true },
		compYear: { type: Number, required: true },
		compKey: { type: String, required: true },
		official: {
			red: storedAllianceSchema,
			blue: storedAllianceSchema,
		},
	},
	{ timestamps: true, collection: 'matches' },
);

export interface MatchI {
	_id: string;
	blue1?: number;
	blue2?: number;
	blue3?: number;
	red1?: number;
	red2?: number;
	red3?: number;
	open: boolean;
	winner: 'red' | 'blue' | 'tie';
	topScorer?: number;
	bottomScorer?: number;
	startTime: number;
	matchNumber: number;
	setNumber: number;
	createdAt: string;
	updatedAt: string;
	compYear: number;
	compKey: string;
	official?: {
		red: StoredTBAMtch;
		blue: StoredTBAMtch;
	};
}

export interface MatchSchedule {
	_id: string;
	blue1?: number;
	blue2?: number;
	blue3?: number;
	red1?: number;
	red2?: number;
	red3?: number;
	open: boolean;
	winner: 'red' | 'blue' | 'tie';
	topScorer?: number;
	bottomScorer?: number;
	startTime: number;
	matchNumber: number;
	setNumber: number;
	createdAt: string;
	updatedAt: string;
	compYear: number;
	compKey: string;
	official?: {
		red: StoredTBAMtch;
		blue: StoredTBAMtch;
	};
}

export type StoredTBAMtch = {
	teleopGrid: Community;
	autoGrid: Community;
	lowCubes: number;
	lowCones: number;
	midCubes: number;
	midCones: number;
	highCubes: number;
	highCones: number;
};

/** From TBA API */
export type TBAMatchRaw = {
	actual_time: number;
	alliances: {
		blue: Alliances;
		red: Alliances;
	};
	comp_level: string;
	event_key: string;
	key: string;
	match_number: number;
	post_result_time: number;
	predicted_time: number;
	score_breakdown: {
		blue: ScoreBreakdown;
		red: ScoreBreakdown;
	};
	set_number: number;
	time: number;
	videos: Video[];
	winning_alliance: string;
};

export type Alliances = {
	dq_team_keys: string[];
	score: number;
	surrogate_team_keys: string[];
	team_keys: string[];
};

export type ScoreBreakdown = {
	activationBonusAchieved: boolean;
	adjustPoints: number;
	autoBridgeState: 'NotLevel' | 'Level';
	autoChargeStationPoints: number;
	autoChargeStationRobot1: AutoChargeStationRobot;
	autoChargeStationRobot2: AutoChargeStationRobot;
	autoChargeStationRobot3: AutoChargeStationRobot;
	autoCommunity: Community;
	autoDocked: boolean;
	autoGamePieceCount: number;
	autoGamePiecePoints: number;
	autoMobilityPoints: number;
	autoPoints: number;
	coopGamePieceCount: number;
	coopertitionCriteriaMet: boolean;
	endGameBridgeState: 'NotLevel' | 'Level';
	endGameChargeStationPoints: number;
	endGameChargeStationRobot1: 'None' | 'Park' | 'Docked';
	endGameChargeStationRobot2: string;
	endGameChargeStationRobot3: string;
	endGameParkPoints: number;
	foulCount: number;
	foulPoints: number;
	linkPoints: number;
	links: Link[];
	mobilityRobot1: YOrN;
	mobilityRobot2: YOrN;
	mobilityRobot3: YOrN;
	rp: number;
	sustainabilityBonusAchieved: boolean;
	techFoulCount: number;
	teleopCommunity: Community;
	teleopGamePieceCount: number;
	teleopGamePiecePoints: number;
	teleopPoints: number;
	totalChargeStationPoints: number;
	totalPoints: number;
};

export type YOrN = 'Yes' | 'No';
export type AutoChargeStationRobot = 'None' | 'Docked';
export type GridCell = 'Cone' | 'Cube' | 'None';

export type Community = {
	B: GridCell[];
	M: GridCell[];
	T: GridCell[];
};

export type Link = {
	nodes: number[];
	row: string;
};

export type Video = {
	key: string;
	type: string;
};

const Match =
	(models?.match as MatchModelType) || model<MatchI, MatchModelType>('match', matchSchema);

export default Match;
