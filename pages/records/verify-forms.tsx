import fetcher from '@/lib/fetch';
import { StandFormI } from '@/models/StandForm';
import { Card, Checkbox, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import useSWR from 'swr';

const VerifyForms = () => {
	const { data: forms } = useSWR<StandFormI[]>('/api/forms/stand?all=true', fetcher);
	const [showGoodMatches, setShowGoodMatches] = useLocalStorage({
		key: 'showGoodMatches',
		defaultValue: false,
	});

	if (!forms) return <Loader size='xl' />;

	const matchNumToNumFormsMap = forms.reduce<
		Record<number, { unique: Set<number>; all: number[] }>
	>((o, form) => {
		if (o[form.matchNumber] !== undefined) {
			o[form.matchNumber].all.push(form.teamNumber);
			o[form.matchNumber].unique.add(form.teamNumber);
		} else {
			o[form.matchNumber] = { all: [], unique: new Set() };
		}
		return o;
	}, {});

	return (
		<Stack align='center'>
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
					.map(([matchNum, numForms]) => (
						<Card withBorder shadow='xl' key={matchNum}>
							<Stack>
								<Title>Match {matchNum}</Title>
								<Text size='xl' fw={600}>
									{numForms.all.length ? numForms.all.join(', ') : 'None'}{' '}
									Submitted
								</Text>
							</Stack>
						</Card>
					))}
			</Group>
		</Stack>
	);
};

export default VerifyForms;
