import { Link } from '@/components/Link';
import fetcher from '@/lib/fetch';
import { MatchI } from '@/models/Match';
import { StandFormI } from '@/models/StandForm';
import {
	Button,
	Card,
	Checkbox,
	Group,
	Highlight,
	Loader,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import useSWR from 'swr';

const VerifyForms = () => {
	const { data: matches } = useSWR<MatchI[]>('/api/matches', fetcher);
	const { data: forms } = useSWR<StandFormI[]>('/api/forms/stand?all=true', fetcher);
	const [showGoodMatches, setShowGoodMatches] = useLocalStorage({
		key: 'showGoodMatches',
		defaultValue: false,
	});

	if (!forms || !matches) return <Loader size='xl' />;

	const matchNumMap = Object.fromEntries(
		matches.map((match) => [match.matchNumber.toString(), match]),
	);
	const matchNumToNumFormsMap = forms.reduce<
		Record<number, { unique: Set<number>; all: number[] }>
	>((o, form) => {
		if (o[form.matchNumber] !== undefined) {
			o[form.matchNumber].all.push(form.teamNumber);
			o[form.matchNumber].unique.add(form.teamNumber);
		} else {
			o[form.matchNumber] = { all: [form.teamNumber], unique: new Set([form.teamNumber]) };
		}
		return o;
	}, {});

	return (
		<Stack align='center'>
			<Button component={Link} href='/records/verify-forms/tba'>
				Verify against TBA
			</Button>
			<Checkbox
				label='Show Good Matches'
				size='xl'
				checked={showGoodMatches}
				onChange={(e) => setShowGoodMatches(e.target.checked)}
			/>
			<Group align='center' position='center'>
				{Object.entries(matchNumToNumFormsMap)
					.filter(([, numForms]) =>
						showGoodMatches
							? true
							: numForms.all.length !== 6 || numForms.unique.size !== 6,
					)
					.map(([matchNum, numForms]) => {
						const match = matchNumMap[matchNum];
						const notInMatch = numForms.all
							.filter(
								(n) =>
									n !== match.blue1 &&
									n !== match.blue2 &&
									n !== match.blue3 &&
									n !== match.red1 &&
									n !== match.red2 &&
									n !== match.red3,
							)
							.join(', ');
						return (
							<Card withBorder shadow='xl' key={matchNum}>
								<Stack spacing={0}>
									<Title>Match {matchNum}</Title>
									<Title order={4}>Blue 1</Title>
									<Highlight fw={600} highlight='None' highlightColor='red'>
										{numForms.all
											.filter((teamNum) => teamNum === match.blue1)
											.join(', ') || 'None'}
									</Highlight>
									<Title order={4}>Blue 2</Title>
									<Highlight fw={600} highlight='None' highlightColor='red'>
										{numForms.all
											.filter((teamNum) => teamNum === match.blue2)
											.join(', ') || 'None'}
									</Highlight>
									<Title order={4}>Blue 3</Title>
									<Highlight fw={600} highlight='None' highlightColor='red'>
										{numForms.all
											.filter((teamNum) => teamNum === match.blue3)
											.join(', ') || 'None'}
									</Highlight>
									<Title order={4}>Red 1</Title>
									<Highlight fw={600} highlight='None' highlightColor='red'>
										{numForms.all
											.filter((teamNum) => teamNum === match.red1)
											.join(', ') || 'None'}
									</Highlight>
									<Title order={4}>Red 2</Title>
									<Highlight fw={600} highlight='None' highlightColor='red'>
										{numForms.all
											.filter((teamNum) => teamNum === match.red2)
											.join(', ') || 'None'}
									</Highlight>
									<Title order={4}>Red 3</Title>
									<Highlight fw={600} highlight='None' highlightColor='red'>
										{numForms.all
											.filter((teamNum) => teamNum === match.red3)
											.join(', ') || 'None'}
									</Highlight>
									{notInMatch && (
										<>
											<Title order={4}>Not In Match</Title>
											<Text color='red' fw={900}>
												{notInMatch}
											</Text>
										</>
									)}
								</Stack>
							</Card>
						);
					})}
			</Group>
		</Stack>
	);
};

export default VerifyForms;
