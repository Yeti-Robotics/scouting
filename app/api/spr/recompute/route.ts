import SPR, { SPRI } from '@/models/SPR';
import StandForm from '@/models/StandForm';
import scoutExpectedContribution from '@/lib/analysis/sprCalculation';
import verifyAdmin from '@/middleware/app-router/verify-user';
import { AggregationSPRDataI, ScoutScore, sprDataAggregation } from '@/models/aggregations/sprData';
import { connectToDbB } from '@/middleware/connect-db';
import { getEventMatches } from '@/lib/fetch/tba';
import { NextRequest, NextResponse } from 'next/server';
import { TBAEventKey } from '@/lib/types/tba/utilTypes';

type TeamScoutMapT = Record<string, string[]>;
type ScoutScoreMapT = Record<string, number>;

/**
 * Retrieves event matches and scout alliances from the database.
 * @returns A promise that resolves to an array containing the match fetch and alliances fetch.
 */
async function getMatchesAndScoutAlliances() {
	await connectToDbB();
	const eventKey = global.compKey.compKey as TBAEventKey;
	const matchFetch = getEventMatches(eventKey, true);
	const alliancesFetch = StandForm.aggregate<AggregationSPRDataI>(sprDataAggregation);
	return Promise.all([matchFetch, alliancesFetch]);
}

/**
 * Builds the teamScoutMap and scoutScoreMap based on the scout scores in the alliance.
 * @param alliance - The alliance object containing scout scores.
 * @returns An object containing the teamScoutMap and scoutScoreMap.
 */
function buildScoutMaps(scoutScores: ScoutScore[]): {
	teamScoutMap: TeamScoutMapT;
	scoutScoreMap: ScoutScoreMapT;
} {
	const teamScoutMap: TeamScoutMapT = {};
	const scoutScoreMap: ScoutScoreMapT = {};
	scoutScores.forEach((scout: any) => {
		teamScoutMap[scout.teamScouted] = teamScoutMap[scout.teamScouted]
			? [...teamScoutMap[scout.teamScouted], scout.scoutID]
			: [scout.scoutID];
		scoutScoreMap[scout.scoutID] = scout.scoutScore;
	});

	return { teamScoutMap, scoutScoreMap };
}

/**
 * Recomputes the SPR (Scout Performance Rating) by retrieving matches and scout alliances,
 * calculating the expected contribution of each scout, and updating the SPR records.
 *
 * @returns A promise that resolves when the SPR recompute is completed.
 */
async function recomputeSPR() {
	const [matches, alliances] = await getMatchesAndScoutAlliances();
	if (matches.length === 0 || alliances.length === 0) {
		return; // don't bother computing if TBA doesn't have data or we haven't submitted yet
	}
	const updatedSPRS: SPRI[] = [];
	alliances.forEach((alliance) => {
		// Verify we have 6 forms for the alliance, if not ignore.
		if (alliance.scoutScores.length === 6) {
			const { matchNumber, alliance: color } = alliance._id;
			const postResultTime = matches[matchNumber - 1]?.post_result_time;
			if (postResultTime && postResultTime > 0) {
				const { scoutScoreMap, teamScoutMap } = buildScoutMaps(alliance.scoutScores);
				const allianceBreakdown = matches[matchNumber - 1].score_breakdown[color];
				const result = scoutExpectedContribution(
					scoutScoreMap,
					teamScoutMap,
					allianceBreakdown.totalPoints - allianceBreakdown.foulPoints,
				);
				Object.keys(result).forEach((scoutID) =>
					updatedSPRS.push({
						matchNumber: alliance._id.matchNumber,
						alliance: alliance._id.alliance,
						scouter: scoutID,
						matchSPR: result[scoutID],
					}),
				);
			}
		}
	});
	// If successfully completed--delete everything currently there and replace with new
	await SPR.deleteMany({});
	await SPR.insertMany(updatedSPRS);
}

/**
 * Recomputes the SPR (Scout Performance Rating) by fetching matches and scout alliances,
 * calculating the expected contribution of each scout, and updating the SPR collection in the database.
 * This function is intended to be used as a POST request handler.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with a JSON response indicating the success of the operation.
 */
export async function POST(req: NextRequest) {
	const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}

	try {
		await recomputeSPR();
		return NextResponse.json({ message: 'success' });
	} catch (err) {
		return NextResponse.json({ message: 'Error: could not recompute SPR' }, { status: 500 });
	}
}
