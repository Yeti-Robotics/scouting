import ScoreBreakdown from './score-breakdown';
import { TBACompLevel, TBAEventKey, TBATeamKey, TBAVideo } from './utilTypes';

interface Alliance {
	dq_team_keys: TBATeamKey[];
	score: number;
	surrogate_team_keys: [];
	team_keys: TBATeamKey[];
}

export default interface TBAMatch {
	actual_time: number | null;
	alliances: {
		blue: Alliance;
		red: Alliance;
	};
	comp_level: TBACompLevel;
	event_key: TBAEventKey;
	key: `${number}${string}`;
	match_number: number;
	post_result_time: number | null;
	predicted_time: number;
	score_breakdown: ScoreBreakdown;
	set_number: number;
	time: number;
	videos: TBAVideo[];
	winning_alliance: 'red' | 'blue' | '';
}
