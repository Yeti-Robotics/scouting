import { MatchI } from '@/models/Match';
import { UserI } from '@/models/User';

/**
 * @returns which team their scouting for
 */
export const userIsScouting = (user: UserI, match: MatchI) => {
	if (!match.scouters) return null;
	if (match.scouters.blue1 === user.username) return match.blue1;
	else if (match.scouters.blue2 === user.username) return match.blue2;
	else if (match.scouters.blue3 === user.username) return match.blue3;
	else if (match.scouters.red1 === user.username) return match.red1;
	else if (match.scouters.red2 === user.username) return match.red2;
	else if (match.scouters.red3 === user.username) return match.red3;
	return null;
};
