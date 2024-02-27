import TBAMatch from '../types/tba/match';
import { TBAEventKey } from '../types/tba/utilTypes';

function getHeaders() {
	const headers = new Headers();
	headers.append('X-TBA-Auth-Key', String(process.env.TBA_SECRET));
	headers.append('accept', 'application/json');
	return headers;
}

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
				res.filter(({ actual_time }) => actual_time && actual_time > 0);
			}
			res.sort((a: any, b: any) => a.actual_time - b.actual_time);
			return res;
		})
		.catch(() => [] as TBAMatch[]);
	return apiRes;
}
