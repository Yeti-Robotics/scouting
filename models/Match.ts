/* eslint-disable @typescript-eslint/ban-types */
import { Subdocument } from '@/lib/api/types';
import { Model, model, models, Schema, Types } from 'mongoose';

const betSchema = new Schema<Bet>(
	{
		username: { type: String, required: true },
		paid: { type: Boolean, default: () => false },
		winner: {
			bet: { type: String, required: false },
			amount: { type: Number, required: false },
			required: false,
		},
		topScorer: {
			bet: { type: Number, required: false },
			amount: { type: Number, required: false },
			required: false,
		},
		bottomScorer: {
			bet: { type: Number, required: false },
			amount: { type: Number, required: false },
			required: false,
		},
	},
	{ timestamps: true, collection: 'bets' },
);

type MatchDocumentProps = {
	bets: Types.DocumentArray<Bet> & Subdocument<Bet, MatchI>[];
};
type MatchModelType = Model<MatchI, {}, MatchDocumentProps>;
const matchSchema = new Schema<MatchI, MatchModelType>(
	{
		blue1: { type: Number, required: false },
		blue2: { type: Number, required: false },
		blue3: { type: Number, required: false },
		red1: { type: Number, required: false },
		red2: { type: Number, required: false },
		red3: { type: Number, required: false },
		winner: { type: String, required: false },
		topScorer: { type: Number, required: false },
		bottomScorer: { type: Number, required: false },
		open: { type: Boolean, required: true },
		startTime: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
		setNumber: { type: Number, required: true },
		bets: [betSchema],
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
	bets: Bet[];
	open: boolean;
	winner: 'red' | 'blue' | 'tie';
	topScorer?: number;
	bottomScorer?: number;
	startTime: number;
	matchNumber: number;
	setNumber: number;
	createdAt: string;
	updatedAt: string;
}

export interface Bet {
	_id: string;
	/** username of better */
	username: string;
	paid: boolean;
	winner?: {
		/** what they bet on, red or blue win */
		bet: 'red' | 'blue';
		amount: number;
	};
	topScorer?: {
		/** who they bet on, team number */
		bet: number;
		amount: number;
	};
	bottomScorer?: {
		/** who they bet on, team number */
		bet: number;
		amount: number;
	};
	createdAt: string;
	updatedAt: string;
}

const Match =
	(models.match as MatchModelType) || model<MatchI, MatchModelType>('match', matchSchema);

export default Match;
