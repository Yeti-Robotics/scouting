/* eslint-disable @typescript-eslint/ban-types */
import { Subdocument } from '@/lib/api/types';
import { Model, model, models, Schema, Types } from 'mongoose';

const betSchema = new Schema<Bet>(
	{
		username: { type: String, required: true },
		winner: {
			bet: { type: String, required: true },
			amount: { type: Number, required: true },
			required: false,
		},
		topScorer: {
			bet: { type: Number, required: true },
			amount: { type: Number, required: true },
			required: false,
		},
		bottomScorer: {
			bet: { type: Number, required: true },
			amount: { type: Number, required: true },
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
		blue1: { type: Number, required: true },
		blue2: { type: Number, required: true },
		blue3: { type: Number, required: true },
		red1: { type: Number, required: true },
		red2: { type: Number, required: true },
		red3: { type: Number, required: true },
		winner: { type: String, required: false },
		topScorer: { type: Number, required: false },
		bottomScorer: { type: Number, required: false },
		open: { type: Boolean, required: true },
		bets: [betSchema],
	},
	{ timestamps: true, collection: 'matches' },
);

export interface MatchI {
	_id: string;
	blue1: number;
	blue2: number;
	blue3: number;
	red1: number;
	red2: number;
	red3: number;
	bets: Bet[];
	open: boolean;
	winner: 'red' | 'blue';
	topScorer: number;
	bottomScorer: number;
}

export interface Bet {
	/** username of better */
	username: string;
	/** number used to identify the competition */
	competition: number;
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
}

const Match =
	(models.match as MatchModelType) || model<MatchI, MatchModelType>('match', matchSchema);

export default Match;
