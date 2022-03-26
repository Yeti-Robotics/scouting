import { getTeamColor, loopTeams } from '@/lib/matchDataUtils';
import { endPosToString } from '@/lib/mode';
import { MatchData } from '@/models/aggregations/matchData';
import { Box, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

interface Props {
	match: MatchData;
}

const EndPosDisplay: React.VFC<{ title: string; match: MatchData; teams: number[] }> = ({
	title,
	teams,
	match,
}) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: 'primary.main',
				borderRadius: 2,
				p: 2,
				m: 2,
			}}
		>
			<h2 style={{ margin: 0 }}>{title}</h2>
			<Box sx={{ display: 'flex' }}>
				{teams.map((teamNum) => (
					<Link key={teamNum} href={`/teams/${teamNum}`} passHref>
						<Box
							component='a'
							sx={{
								p: 1,
								backgroundColor: getTeamColor(match, teamNum),
								borderRadius: 2,
								m: 1,
								cursor: 'pointer',
								fontWeight: 500,
							}}
						>
							{teamNum}
						</Box>
					</Link>
				))}
			</Box>
		</Box>
	);
};

const EndPositions: React.VFC<Props> = ({ match }) => {
	const endPos: Record<number, number[]> = {};
	loopTeams(match, (team) => {
		if (!team) return;
		if (!endPos[team.endPosition]) {
			endPos[team.endPosition] = [];
		}
		endPos[team.endPosition].push(team.teamNumber);
	});

	console.log(endPos);

	return (
		<>
			<Box component='h1' sx={{ mt: 6 }}>
				End Positions
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexWrap: 'wrap',
				}}
			>
				{Object.keys(endPos)
					.sort((a, b) => b.localeCompare(a))
					.map((endPosNum) => {
						const endPosString = endPosToString(Number(endPosNum));
						return (
							<EndPosDisplay
								key={endPosNum}
								match={match}
								title={endPosString}
								teams={endPos[Number(endPosNum)]}
							/>
						);
					})}
			</Box>
		</>
	);
};

export default EndPositions;
