import Link from 'next/link';
import StandForm, { StandFormI } from '@/models/StandForm';
import verifyAdmin from '@/middleware/app-router/verify-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cookies } from 'next/headers';
import { connectToDbB } from '@/middleware/connect-db';
import { getEventMatches } from '@/lib/fetchers/tba';
import { TBAEventKey, TBATeamKey } from '@/lib/types/tba/utilTypes';
import {
	MatchNumberToMatch,
	findAllianceErrors,
	findFormsNotMatching,
	findIndividualFormErrors,
} from './utils';
import {
	AllianceReportedTotals,
	TeamStandFormsByMatch,
	allianceReportedTotals,
	teamStandFormsByMatch,
} from './aggregations';

export default async function VerifyFormAccuracyPage() {
	const access_token = cookies().get('access_token')?.value;
	const isAdmin = await verifyAdmin(access_token);
	if (!isAdmin) {
		return <div>You aren't authorized</div>;
	}
	await connectToDbB();

	if (!global.compKey.compKey) {
		return <div>Current competition not set</div>;
	}

	const [standFormsGroupedByTeamMatch, allianceTotals, tbaMatchesData] = await Promise.all([
		StandForm.aggregate<TeamStandFormsByMatch>(teamStandFormsByMatch),
		StandForm.aggregate<AllianceReportedTotals>(allianceReportedTotals),
		getEventMatches(global.compKey.compKey as TBAEventKey, true).then((res) =>
			res.filter((i) => i.comp_level === 'qm'),
		),
	]).catch(() => {
		return [null, null, null];
	});

	if (!standFormsGroupedByTeamMatch || !allianceTotals || !tbaMatchesData) {
		return <div>Error fetching data</div>;
	}

	const matchNumMap: MatchNumberToMatch = Object.fromEntries(
		tbaMatchesData.map((match) => [match.match_number.toString(), match]),
	);

	const mismatchedTeamMatches = findFormsNotMatching(standFormsGroupedByTeamMatch);
	const { alliancesWithMismatchedFields, alliancesMissingTeams } = findAllianceErrors(
		matchNumMap,
		allianceTotals,
	);
	const individualFormErrors = findIndividualFormErrors(
		standFormsGroupedByTeamMatch,
		matchNumMap,
	);

	mismatchedTeamMatches.sort((a, b) => a.matchNumber - b.matchNumber);
	individualFormErrors.sort((a, b) => a.matchNumber - b.matchNumber);
	alliancesWithMismatchedFields.sort((a, b) => a.matchNumber - b.matchNumber);
	alliancesMissingTeams.sort((a, b) => a.matchNumber - b.matchNumber);

	return (
		<main className='mx-auto mt-8 max-w-5xl px-4 pb-16'>
			<section>
				<h2 className='typography'>Mismatched Individual Forms</h2>
				<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
					{mismatchedTeamMatches.map((i) => {
						return (
							<Card key={`${i.teamNumber} + ${i.matchNumber}`}>
								<CardHeader className='p-6'>
									<CardTitle>Match {i.matchNumber}</CardTitle>
								</CardHeader>
								<CardContent className='pt-0'>
									Team {i.teamNumber} <br />
									<Link
										className='text-primary hover:underline'
										href={`/records/stand-forms/${i.idForm1}`}
										target='_blank'
									>
										Form 1
									</Link>{' '}
									<br />
									<Link
										className='text-primary hover:underline'
										href={`/records/stand-forms/${i.idForm2}`}
										target='_blank'
									>
										Form 2
									</Link>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
			<section className='mt-4'>
				<h2 className='typography'>Individual Form Errors</h2>
				<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
					{individualFormErrors.map((i) => {
						return (
							<Card key={`${i.teamNumber} + ${i.matchNumber}`}>
								<CardHeader className='p-6'>
									<CardTitle>
										Match {i.matchNumber} - Team {i.teamNumber}
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-0'>
									<p>
										<strong>Errors:</strong>
										<br /> {i.errors.join(', ')}
									</p>
									<Link
										className='text-primary hover:underline'
										href={`/records/stand-forms/${i._id}`}
										target='_blank'
									>
										View Form
									</Link>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
			<section className='mt-4'>
				<h2 className='typography'>Mismatched Fields with TBA</h2>
				<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
					{alliancesWithMismatchedFields.map((i) => {
						return (
							<Card
								key={`${i.matchNumber} + ${i.alliance === 'red' ? 'Red' : 'Blue'}`}
							>
								<CardHeader className='p-6'>
									<CardTitle>
										Match {i.matchNumber} -{' '}
										{i.alliance === 'red' ? 'Red' : 'Blue'}
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-0'>
									<p>
										<strong>Mismatched Fields:</strong>
										<br /> {i.mismatchedFields.join(', ')}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
			<section className='mt-4'>
				<h2 className='typography'>Alliances Missing Teams</h2>
				<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
					{alliancesMissingTeams.map((i) => {
						return (
							<Card
								key={`${i.matchNumber} + ${i.alliance === 'red' ? 'Red' : 'Blue'}`}
							>
								<CardHeader className='p-6'>
									<CardTitle>
										Match {i.matchNumber} -{' '}
										{i.alliance === 'red' ? 'Red' : 'Blue'} Alliance
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-0'>Missing Team Data!</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
		</main>
	);
}
