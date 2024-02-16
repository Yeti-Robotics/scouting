import { sprDataAggregation } from '@/models/aggregations/sprData';
import StandForm from '@/models/StandForm';
import scoutExpectedContribution from '@/lib/analysis/sprCalculation';
import SPR from '@/models/SPR';
import { connectToDbB } from '@/middleware/connect-db';
import verifyAdmin from '@/middleware/app-router/verify-user';
import { NextRequest, NextResponse } from 'next/server';

type TeamScoutMapT = Record<string, string[]>;

type ScoutScoreMapT = Record<string, number>;

interface AggregationSPRDataI {
	_id: {
		eventID: string;
		matchNumber: number;
		alliance: string;
	};
	scoutScores: {
		scoutID: string;
		teamScouted: number;
		scoutScore: number;
	}[];
}

interface updatedSPRSI {
	eventKey: string;
	matchNumber: number;
	alliance: string;
	scouter: string;
	matchSPR: number;
}

async function recomputeSPR() {
	await connectToDbB();
	await SPR.deleteMany({});
	const alliances = await StandForm.aggregate<AggregationSPRDataI>(sprDataAggregation);
	const teamScoutMap: TeamScoutMapT = {};
	const scoutScoreMap: ScoutScoreMapT = {};
	const updatedSPRS: updatedSPRSI[] = [];

	alliances.forEach((alliance) => {
		alliance.scoutScores.forEach((scout) => {
			teamScoutMap[scout.teamScouted] = teamScoutMap[scout.teamScouted]
				? [...teamScoutMap[scout.teamScouted], scout.scoutID]
				: [scout.scoutID];
			scoutScoreMap[scout.scoutID] = scout.scoutScore;
		});
		const result = scoutExpectedContribution(scoutScoreMap, teamScoutMap, 42);
		Object.keys(result).forEach((scoutID) =>
			updatedSPRS.push({
				eventKey: alliance._id.eventID,
				matchNumber: alliance._id.matchNumber,
				alliance: alliance._id.alliance,
				scouter: scoutID,
				matchSPR: result[scoutID],
			}),
		);
	});
	SPR.insertMany(updatedSPRS);
}

export async function POST(req: NextRequest) {
	const access_token = req.cookies.get('access_token')?.value;
	const isAdmin = verifyAdmin(access_token);

	if (!isAdmin) {
		return NextResponse.json({ message: 'Access Forbidden' }, { status: 403 });
	}

	await recomputeSPR();

	return NextResponse.json({ message: 'success' });
}
