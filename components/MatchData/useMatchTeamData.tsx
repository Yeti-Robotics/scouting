import fetcher from '@/lib/fetch';
import { MatchI } from '@/models/Match';
import { RawTeamData } from '@/models/aggregations/teamData';
import { useMemo } from 'react';
import useSWR from 'swr';

export type MatchTeamData = {
	blue1?: RawTeamData;
	blue2?: RawTeamData;
	blue3?: RawTeamData;
	red1?: RawTeamData;
	red2?: RawTeamData;
	red3?: RawTeamData;
};

export const useMatchTeamData = (matchId: string | null | undefined): MatchTeamData | null => {
	const { data: match } = useSWR<MatchI>(matchId ? `/api/matches/${matchId}` : null, fetcher);
	const { data: teamData } = useSWR<RawTeamData[]>(`/api/team-data`, fetcher);

	const data = useMemo(
		() =>
			teamData && match
				? teamData.reduce<MatchTeamData>((acc, team) => {
						if (match.blue1 === team.teamNumber) {
							acc.blue1 = team;
						} else if (match.blue2 === team.teamNumber) {
							acc.blue2 = team;
						} else if (match.blue3 === team.teamNumber) {
							acc.blue3 = team;
						} else if (match.red1 === team.teamNumber) {
							acc.red1 = team;
						} else if (match.red2 === team.teamNumber) {
							acc.red2 = team;
						} else if (match.red3 === team.teamNumber) {
							acc.red3 = team;
						}

						return acc;
				  }, {})
				: null,
		[teamData, match],
	);

	return data;
};
