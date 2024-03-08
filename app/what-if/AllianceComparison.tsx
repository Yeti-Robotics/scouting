'use client';

import TeamSelect from './TeamSelect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { erf } from 'mathjs';
import { TeamData } from '@/models/aggregations/teamData';

type AllianceMemberData = undefined | TeamData;
type AllianceCardData = {
	title: string;
	color: string;
};

interface Alliance {
	1: AllianceMemberData;
	2: AllianceMemberData;
	3: AllianceMemberData;
}

interface Alliances {
	red: Alliance;
	blue: Alliance;
}

const scoreNumberFormat = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 0,
	minimumFractionDigits: 0,
});

const allianceCardData: Record<'red' | 'blue', AllianceCardData> = {
	red: {
		title: 'Red Alliance',
		color: 'before:bg-red-400',
	},
	blue: {
		title: 'Blue Alliance',
		color: 'before:bg-blue-400',
	},
};

const defaultAlliances: Alliances = {
	red: {
		1: undefined,
		2: undefined,
		3: undefined,
	},
	blue: {
		1: undefined,
		2: undefined,
		3: undefined,
	},
};

function cdfNormal(x: number, mean: number, stdDev: number) {
	return (1 - erf((mean - x) / (stdDev * Math.sqrt(2)))) / 2;
}

function AllianceStats({
	allianceCardData,
	winProb,
	allianceData,
}: {
	allianceCardData: AllianceCardData;
	winProb: number;
	allianceData: Alliance;
}) {
	const epa = Object.values(allianceData).reduce((acc, cur) => acc + (cur?.epa || 0), 0);
	const autoScore = Object.values(allianceData).reduce(
		(acc, cur) => acc + (cur?.avgAutoScore || 0),
		0,
	);
	const teleopScore = Object.values(allianceData).reduce(
		(acc, cur) => acc + (cur?.avgTeleopScore || 0),
		0,
	);
	const endgameScore = Object.values(allianceData).reduce(
		(acc, cur) => acc + (cur?.avgEndScore || 0),
		0,
	);

	return (
		<Card>
			<CardHeader className='p-6'>
				<CardTitle
					className={`flex items-center ${allianceCardData.color} before:mr-1 before:inline-block before:h-4 before:w-4 before:rounded-sm before:content-[""]`}
				>
					{allianceCardData.title} Projections
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2 p-6 pt-0'>
				<p className='lead'>
					<span className='font-bold'>{scoreNumberFormat.format(winProb * 100)}%</span>{' '}
					chance of winning
				</p>
				<div>
					<p className='lead'>
						<span className='mr-2 text-2xl font-bold text-foreground'>
							{scoreNumberFormat.format(epa)}
						</span>
						Estimated Score
					</p>
					<p className='lead'>
						<span className='mr-2 text-2xl font-bold text-foreground'>
							{scoreNumberFormat.format(autoScore)}
						</span>
						Auto Points
					</p>
					<p className='lead'>
						<span className='mr-2 text-2xl font-bold text-foreground'>
							{scoreNumberFormat.format(teleopScore)}
						</span>
						Teleop Points
					</p>
					<p className='lead'>
						<span className='mr-2 text-2xl font-bold text-foreground'>
							{scoreNumberFormat.format(endgameScore)}
						</span>
						Endgame Points
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

export default function AllianceComparison({
	teams,
	data,
}: {
	teams: { team_number: number; team_name: string }[];
	data: TeamData[];
}): JSX.Element {
	const [allianceData, setAllianceData] = useState(defaultAlliances);

	const handleAllianceMemberChange = async (
		team: string,
		alliance: 'red' | 'blue',
		position: keyof Alliance,
	) => {
		const newData = data.find((d) => d.teamNumber === parseInt(team));

		setAllianceData((prev) => {
			return {
				...prev,
				[alliance]: {
					...prev[alliance],
					[position]: newData,
				},
			};
		});
	};

	const redEPA =
		(allianceData.red[1]?.epa || 0) +
		(allianceData.red[2]?.epa || 0) +
		(allianceData.red[3]?.epa || 0);
	const blueEPA =
		(allianceData.blue[1]?.epa || 0) +
		(allianceData.blue[2]?.epa || 0) +
		(allianceData.blue[3]?.epa || 0);
	const redStdDev = Math.sqrt(
		(allianceData.red[1]?.epaDev || 0) ** 2 +
			(allianceData.red[2]?.epaDev || 0) ** 2 +
			(allianceData.red[3]?.epaDev || 0) ** 2,
	);
	const blueStdDev = Math.sqrt(
		(allianceData.blue[1]?.epaDev || 0) ** 2 +
			(allianceData.blue[2]?.epaDev || 0) ** 2 +
			(allianceData.blue[3]?.epaDev || 0) ** 2,
	);
	const redWinProb = cdfNormal(0, blueEPA - redEPA, redStdDev + blueStdDev) || 0.5;
	const blueWinProb = 1 - redWinProb;

	return (
		<div>
			<div className='grid grid-cols-1 gap-4'>
				{Object.entries(allianceCardData).map(([alliance, data]) => {
					return (
						<Card key={alliance}>
							<CardHeader className='p-6'>
								<CardTitle
									className={`flex items-center before:mr-1 before:inline-block before:h-4 before:w-4 before:rounded-sm ${data.color}`}
								>
									{data.title}
								</CardTitle>
							</CardHeader>
							<CardContent className='flex flex-col space-x-0 space-y-2 p-6 pt-0 sm:flex-row sm:space-x-2 sm:space-y-0'>
								{([1, 2, 3] as (keyof Alliance)[]).map((position) => (
									<TeamSelect
										key={position}
										teams={teams}
										value={
											allianceData[alliance as 'red' | 'blue'][
												position
											]?.teamNumber.toString() || ''
										}
										setValue={(newTeam: string) =>
											handleAllianceMemberChange(
												newTeam,
												alliance as 'red' | 'blue',
												position,
											)
										}
									/>
								))}
							</CardContent>
						</Card>
					);
				})}
			</div>
			<div className='my-8'>
				<h2 className='typography border-none'>Projected Score</h2>
				<p
					className={`lead ${redWinProb === blueWinProb ? '' : redWinProb > blueWinProb ? 'text-red-400' : 'text-blue-400'}`}
				>
					{redEPA > blueEPA
						? `${scoreNumberFormat.format(redWinProb * 100)}% chance of red winning`
						: `${scoreNumberFormat.format(blueWinProb * 100)}% chance of blue winning`}
				</p>
				<h3 className='mt-2 text-3xl font-bold'>
					<span className='text-red-400 '>{scoreNumberFormat.format(redEPA)}</span>-
					<span className='text-blue-400'>{scoreNumberFormat.format(blueEPA)}</span>
				</h3>
			</div>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<AllianceStats
					allianceCardData={allianceCardData.red}
					winProb={redWinProb}
					allianceData={allianceData.red}
				/>
				<AllianceStats
					allianceCardData={allianceCardData.blue}
					winProb={blueWinProb}
					allianceData={allianceData.blue}
				/>
			</div>
		</div>
	);
}
