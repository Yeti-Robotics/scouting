import { MatchData } from '@/models/aggregations/matchData';
import { Box, Group, Paper, Text, Title } from '@mantine/core';
import { StandFormWithName } from '@/models/aggregations/standFormWithName';
import { getTeamColor } from '@/lib/matchDataUtils';

interface Props {
	match: MatchData;
}

const CommentDisplay = ({ team, color }: { team: StandFormWithName; color?: string }) => {
	return (
		<Paper bg={color} withBorder p='xs'>
			<Title order={2} align='center'>
				{team.teamNumber}
			</Title>
			<Text maw={300} style={{ textAlign: 'center' }}>
				{team.notes}
			</Text>
		</Paper>
	);
};

const Comments = ({ match }: Props) => {
	return (
		<>
			<Box component='h1' sx={{ mt: 6 }}>
				Comments
			</Box>
			<Group align='center' position='center'>
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
			</Group>
		</>
	);
};

export default Comments;
