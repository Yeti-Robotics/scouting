import { MatchData } from '@/models/aggregations/matchData';
import { Box } from '@mui/material';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { getTeamColor } from '@/lib/matchDataUtils';

interface Props {
	match: MatchData;
}

const CommentDisplay: React.VFC<{ team: StandFormWithName; color: string }> = ({ team, color }) => {
	return (
		<Box
			sx={{
				borderRadius: 2,
				backgroundColor: color,
				m: 2,
				p: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Box component='h2'>{team.teamNumber}</Box>
			<p style={{ textAlign: 'center' }}>{team.notes}</p>
		</Box>
	);
};

const Comments: React.VFC<Props> = ({ match }) => {
	return (
		<>
			<Box component='h1' sx={{ mt: 6 }}>
				Comments
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				{match.blue1 && (
					<CommentDisplay team={match.blue1} color={getTeamColor(match, match.blue1)} />
				)}
				{match.blue2 && (
					<CommentDisplay team={match.blue2} color={getTeamColor(match, match.blue2)} />
				)}
				{match.blue3 && (
					<CommentDisplay team={match.blue3} color={getTeamColor(match, match.blue3)} />
				)}
				{match.red1 && (
					<CommentDisplay team={match.red1} color={getTeamColor(match, match.red1)} />
				)}
				{match.red2 && (
					<CommentDisplay team={match.red2} color={getTeamColor(match, match.red2)} />
				)}
				{match.red3 && (
					<CommentDisplay team={match.red3} color={getTeamColor(match, match.red3)} />
				)}
			</Box>
		</>
	);
};

export default Comments;
