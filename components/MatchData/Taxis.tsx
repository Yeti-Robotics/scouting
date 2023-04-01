import { MatchData } from '@/models/aggregations/matchData';
import { Card, Group, Text, Title } from '@mantine/core';

interface Props {
	match: MatchData;
}

const Taxis = ({ match }: Props) => {
	return (
		<>
			<Title mt='md' align='center'>
				Taxis
			</Title>
			<Group align='center' position='center'>
				{(match.blue1 || match.blue2 || match.blue3) && (
					<Card withBorder shadow='xl' bg='blue' sx={{ color: 'white' }}>
						{match.blue1?.initiationLine && (
							<Text size='xl'>{match.blue1?.teamNumber}</Text>
						)}
						{match.blue2?.initiationLine && (
							<Text size='xl'>{match.blue2?.teamNumber}</Text>
						)}
						{match.blue3?.initiationLine && (
							<Text size='xl'>{match.blue3?.teamNumber}</Text>
						)}
					</Card>
				)}
				{(match.red1 || match.red2 || match.red3) && (
					<Card withBorder shadow='xl' bg='red' sx={{ color: 'white' }}>
						{match.red1?.initiationLine && (
							<Text size='xl'>{match.red1?.teamNumber}</Text>
						)}
						{match.red2?.initiationLine && (
							<Text size='xl'>{match.red2?.teamNumber}</Text>
						)}
						{match.red3?.initiationLine && (
							<Text size='xl'>{match.red3?.teamNumber}</Text>
						)}
					</Card>
				)}
			</Group>
		</>
	);
};

export default Taxis;
