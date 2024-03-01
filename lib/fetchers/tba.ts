import TBAMatch from '../types/tba/match';
import { TBAEventKey } from '../types/tba/utilTypes';

function getHeaders() {
	const headers = new Headers();
	headers.append('X-TBA-Auth-Key', String(process.env.TBA_SECRET));
	headers.append('accept', 'application/json');
	return headers;
}

const sortOrder = {
	qm: 0,
	qf: 1,
	sf: 2,
	f: 3,
};

export async function getEventMatches(
	eventKey: TBAEventKey,
	completedOnly: boolean = false,
): Promise<TBAMatch[]> {
	const headers = getHeaders();
	const apiRes = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`, {
		headers,
	})
		.then((res) => res.json())
		.then((res: TBAMatch[]) => {
			if (completedOnly) {
				res = res.filter(({ actual_time }) => actual_time > 0);
			}
			res.sort((a, b) => {
				const [aSort, bSort] = [sortOrder[a.comp_level], sortOrder[b.comp_level]];
				if (aSort === bSort) {
					return a.match_number - b.match_number;
				}
				return aSort - bSort;
			});
			return res;
		})
		.catch((): TBAMatch[] => []);
	return apiRes;
}
