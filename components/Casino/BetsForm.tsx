import { Bet, MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Box, Button, Checkbox, Input, Title } from '@mantine/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../Forms/FormSection';
import { ControlledSegmentedControl } from '../Forms/ControlledSegmentedControl';
import { ControlledNumberInput } from '../Forms/ControlledNumberInput';
import { NumberSelect } from '../Forms/NumberSelect';

interface Props {
	match: MatchI;
	user: UserI;
	id: string;
}

const numberValidate = (value: any) => !isNaN(parseFloat(value));
const textValidate = (value: any) => value !== '';

const BetsForm = ({ match, user, id }: Props) => {
	const { handleSubmit, control, watch } = useForm<Omit<Bet, 'username'>>();
	const [notBetting, setNotBetting] = useState({
		winner: false,
		topScorer: false,
		bottomScorer: false,
	});
	const [fetching, setFetching] = useState<'' | 'fetching' | 'done'>('');
	const winnerAmount = watch('winner.amount');
	const topScorerAmount = watch('topScorer.amount');
	const bottomScorerAmount = watch('bottomScorer.amount');

	const yourCoins =
		user.coins -
		((!notBetting.winner ? Number(winnerAmount) || 0 : 0) +
			(!notBetting.topScorer ? Number(topScorerAmount) || 0 : 0) +
			(!notBetting.bottomScorer ? Number(bottomScorerAmount) || 0 : 0));
	const betsClosed = match.startTime < Date.now() / 1000; // 5 mins before match is supposed to start

	const teams = {
		blue1: match.blue1,
		blue2: match.blue2,
		blue3: match.blue3,
		red1: match.red1,
		red2: match.red2,
		red3: match.red3,
	};

	return (
		<>
			<h1>Bets {betsClosed && '(Closed)'}</h1>
			<Box
				component='form'
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					alignItems: 'center',
				}}
				onSubmit={handleSubmit((data) => {
					if (!user || yourCoins < 0 || fetching === 'fetching') return;
					if (notBetting.winner) data.winner = undefined;
					if (notBetting.bottomScorer) data.bottomScorer = undefined;
					if (notBetting.topScorer) data.topScorer = undefined;
					if (!data.winner && !data.bottomScorer && !data.topScorer) return;

					setFetching('fetching');
					fetch(`/api/matches/${id}/bet`, {
						method: 'POST',
						body: JSON.stringify(data),
					}).then((res) => {
						if (res.ok) {
							setFetching('done');
							location.reload();
						}
					});
				})}
			>
				<FormSection title='Who Wins' color={notBetting.winner ? 'dimgrey' : undefined}>
					<Title order={2}>
						Pick which alliance you think will win and how much you want to bet.
					</Title>
					<Title order={3}>1.5x return</Title>
					<Title order={3}>You are not required to bet on every section.</Title>
					<h4 style={{ fontWeight: 'bold', color: 'rgb(150, 150, 50)' }}>
						Your Coins: {yourCoins}
					</h4>
					<Input.Wrapper label='Who Will Win?' required={!notBetting.winner}>
						<ControlledSegmentedControl
							control={control}
							name='winner.bet'
							data={[
								{ value: 'blue', label: 'Blue Alliance' },
								{ value: 'red', label: 'Red Alliance' },
							]}
							disabled={betsClosed || notBetting.winner}
							rules={{
								required: !notBetting.winner,
								validate: notBetting.winner ? undefined : textValidate,
							}}
						/>
					</Input.Wrapper>
					<ControlledNumberInput
						control={control}
						name='winner.amount'
						label='Amount to Bet'
						disabled={betsClosed || notBetting.winner}
						rules={{
							required: !notBetting.winner,
							min: 1,
							validate: notBetting.winner ? undefined : numberValidate,
						}}
						min={1}
					/>
					<Checkbox
						onChange={(e) =>
							setNotBetting((prev) => ({ ...prev, winner: e.target.checked }))
						}
						size='xl'
						label='Not Betting'
						checked={notBetting.winner}
						disabled={betsClosed}
					/>
				</FormSection>
				<FormSection
					title='Who Scores The Most'
					color={notBetting.topScorer ? 'dimgrey' : undefined}
				>
					<Title order={2}>
						Pick which alliance you think will win and how much you want to bet.
					</Title>
					<Title order={3}>2x return</Title>
					<Title order={3}>You are not required to bet on every section.</Title>
					<h4 style={{ fontWeight: 'bold', color: 'rgb(150, 150, 50)' }}>
						Your Coins: {yourCoins}
					</h4>
					<NumberSelect
						control={control}
						data={Object.values(teams)
							.map((teamNumber) => teamNumber ?? 0)
							.filter((n) => n)}
						name='topScorer.bet'
						label='Who will score the most?'
						disabled={betsClosed || notBetting.topScorer}
						rules={{
							required: !notBetting.topScorer,
							validate: notBetting.topScorer ? undefined : textValidate,
						}}
					/>
					<ControlledNumberInput
						control={control}
						type='number'
						name='topScorer.amount'
						label='Amount to Bet'
						disabled={betsClosed || notBetting.topScorer}
						rules={{
							required: !notBetting.topScorer,
							min: 1,
							validate: notBetting.topScorer ? undefined : numberValidate,
						}}
						min={1}
					/>

					<Checkbox
						onChange={(e) =>
							setNotBetting((prev) => ({
								...prev,
								topScorer: e.target.checked,
							}))
						}
						size='xl'
						label='Not Betting'
						checked={notBetting.topScorer}
						disabled={betsClosed}
					/>
				</FormSection>
				<FormSection
					title='Who Scores The Least'
					color={notBetting.bottomScorer ? 'dimgrey' : undefined}
				>
					<Title order={2}>
						Pick which alliance you think will win and how much you want to bet.
					</Title>
					<Title order={3}>2x return</Title>
					<Title order={3}>You are not required to bet on every section.</Title>
					<h4 style={{ fontWeight: 'bold', color: 'rgb(150, 150, 50)' }}>
						Your Coins: {yourCoins}
					</h4>
					<NumberSelect
						control={control}
						data={Object.values(teams)
							.map((teamNumber) => teamNumber ?? 0)
							.filter((n) => n)}
						name='bottomScorer.bet'
						label='Who will score the least?'
						disabled={betsClosed || notBetting.bottomScorer}
						rules={{
							required: !notBetting.bottomScorer,
							validate: notBetting.bottomScorer ? undefined : textValidate,
						}}
					/>
					<ControlledNumberInput
						control={control}
						type='number'
						name='bottomScorer.amount'
						label='Amount to Bet'
						disabled={betsClosed || notBetting.bottomScorer}
						rules={{
							required: !notBetting.bottomScorer,
							validate: notBetting.bottomScorer ? undefined : numberValidate,
							min: 1,
						}}
						min={1}
					/>

					<Checkbox
						onChange={(e) =>
							setNotBetting((prev) => ({
								...prev,
								bottomScorer: e.target.checked,
							}))
						}
						size='xl'
						label='Not Betting'
						checked={notBetting.bottomScorer}
						disabled={betsClosed}
					/>
				</FormSection>
				<Button type='submit' loading={fetching === 'fetching'} disabled={betsClosed}>
					Submit Bets
				</Button>
				<p>After you submit your bets you will not be able to change them.</p>
			</Box>
		</>
	);
};

export default BetsForm;
