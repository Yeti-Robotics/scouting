import { Model, model, models, Schema } from 'mongoose';

const matchSchema = new Schema<MatchI>(
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
		bets: [
			{
				type: new Schema<Bet>(
					{
						username: { type: String, required: true },
						winner: {
							bet: { type: String, required: false },
							amount: { type: Number, required: false },
						},
						topScorer: {
							bet: { type: Number, required: false },
							amount: { type: Number, required: false },
						},
						bottomScorer: {
							bet: { type: String, required: false },
							amount: { type: Number, required: false },
						},
					},
					{ timestamps: true, collection: 'bets' },
				),
				required: true,
				default: () => [],
			},
		],
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
	winner: {
		/** what they bet on, red or blue win */
		bet?: 'red' | 'blue';
		amount?: number;
	};
	topScorer?: {
		/** who they bet on, team number */
		bet?: number;
		amount?: number;
	};
	bottomScorer?: {
		/** who they bet on, team number */
		bet?: number;
		amount?: number;
	};
}

const Match = (models.match as Model<MatchI>) || model('match', matchSchema);

export default Match;
