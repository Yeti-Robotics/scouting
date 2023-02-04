import { MatchData } from '@/models/aggregations/matchData';
import { Box, useMantineTheme } from '@mantine/core';

interface Props {
	match: MatchData;
}

const Taxis = ({ match }: Props) => {
	const theme = useMantineTheme();
	return (
		<>
			<Box component='h1' sx={{ mt: 6 }}>
				Taxis
			</Box>
			<Box
				sx={{
					display: 'flex',
					backgroundColor: 'primary.main',
					p: 2,
					borderRadius: 2,
					color: 'white',
					fontWeight: 500,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						backgroundColor: theme.colors.blue[5],
						px: 2,
						borderRadius: 2,
						m: 1,
					}}
				>
					{match.blue1?.initiationLine && <p>{match.blue1?.teamNumber}</p>}
					{match.blue2?.initiationLine && <p>{match.blue2?.teamNumber}</p>}
					{match.blue3?.initiationLine && <p>{match.blue3?.teamNumber}</p>}
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						backgroundColor: theme.colors.red[5],
						px: 2,
						borderRadius: 2,
						m: 1,
					}}
				>
					{match.red1?.initiationLine && <p>{match.red1?.teamNumber}</p>}
					{match.red2?.initiationLine && <p>{match.red2?.teamNumber}</p>}
					{match.red3?.initiationLine && <p>{match.red3?.teamNumber}</p>}
				</Box>
			</Box>
		</>
	);
};

export default Taxis;
