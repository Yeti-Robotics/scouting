import { Bet, MatchI } from '@/models/Match';
import { UserI } from '@/models/User';
import { Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormSection from '../Forms/FormSection';
import { Form } from '../Forms/FormStyle';
import Select from '../Forms/Select';
import SubmitButton from '../Forms/SubmitButton';
import TextInput from '../Forms/TextInput';

interface Props {
	match: MatchI;
	user: UserI;
}

const BetsForm: React.VFC<Props> = ({ match, user }) => {
	const { handleSubmit, control, watch, reset } = useForm<Omit<Bet, 'username'>>();
	const [notBetting, setNotBetting] = useState({
		winner: false,
		topScorer: false,
		bottomScorer: false,
	});
	const winnerAmount = watch('winner.amount');
	const topScorerAmount = watch('topScorer.amount');
	const bottomScorerAmount = watch('bottomScorer.amount');

	const yourCoins =
		user.coins - Number(winnerAmount) - Number(topScorerAmount) - Number(bottomScorerAmount);
	const betsClosed = false; // match.startTime < Date.now() + 300000;

	return (
		<>
			<h1>Bets {betsClosed && '(Closed)'}</h1>
			<Form onSubmit={handleSubmit((data) => console.log(data))}>
				<FormSection title='Who Wins'>
					<h2>Pick which alliance you think will win and how much you want to bet.</h2>
					<h3>You are not required to bet on every section.</h3>
					<h4 style={{ fontWeight: 'bold', color: 'rgb(150, 150, 50)' }}>
						Your Coins: {yourCoins}
					</h4>
					<Select
						control={control}
						name='winner.bet'
						label='Who will win?'
						disabled={betsClosed || notBetting.winner}
						rules={{ required: !notBetting.winner }}
					>
						<MenuItem value='blue'>Blue Alliance</MenuItem>
						<MenuItem value='red'>Red Alliance</MenuItem>
					</Select>
					<TextInput
						control={control}
						type='number'
						name='winner.amount'
						label='Amount to Bet'
						disabled={betsClosed || notBetting.winner}
						rules={{ required: !notBetting.winner, min: 1 }}
					/>
					<FormControlLabel
						label='Not Betting on This Section'
						control={
							<Checkbox
								onChange={(e) =>
									setNotBetting((prev) => ({ ...prev, winner: e.target.checked }))
								}
								sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
								checked={notBetting.winner}
								disabled={betsClosed}
								defaultChecked={false}
							/>
						}
					/>
				</FormSection>
				<FormSection title='Who Scores The Most'>
					<h2>Pick which alliance you think will win and how much you want to bet.</h2>
					<h3>You are not required to bet on every section.</h3>
					<h4 style={{ fontWeight: 'bold', color: 'rgb(150, 150, 50)' }}>
						Your Coins: {yourCoins}
					</h4>
					<Select
						control={control}
						name='topScorer.bet'
						label='Who will score the most?'
						disabled={betsClosed || notBetting.topScorer}
						rules={{ required: !notBetting.topScorer }}
					>
						{match.blue1 && <MenuItem value={match.blue1}>{match.blue1}</MenuItem>}
						{match.blue2 && <MenuItem value={match.blue1}>{match.blue2}</MenuItem>}
						{match.blue3 && <MenuItem value={match.blue1}>{match.blue3}</MenuItem>}
						{match.red1 && <MenuItem value={match.red1}>{match.red1}</MenuItem>}
						{match.red2 && <MenuItem value={match.red2}>{match.red2}</MenuItem>}
						{match.red3 && <MenuItem value={match.red3}>{match.red3}</MenuItem>}
					</Select>
					<TextInput
						control={control}
						type='number'
						name='topScorer.amount'
						label='Amount to Bet'
						disabled={betsClosed || notBetting.topScorer}
						rules={{ required: !notBetting.topScorer, min: 1 }}
					/>
					<FormControlLabel
						label='Not Betting on This Section'
						control={
							<Checkbox
								onChange={(e) =>
									setNotBetting((prev) => ({
										...prev,
										topScorer: e.target.checked,
									}))
								}
								sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
								checked={notBetting.topScorer}
								disabled={betsClosed}
								defaultChecked={false}
							/>
						}
					/>
				</FormSection>
				<FormSection title='Who Scores The Least'>
					<h2>Pick which alliance you think will win and how much you want to bet.</h2>
					<h3>You are not required to bet on every section.</h3>
					<h4 style={{ fontWeight: 'bold', color: 'rgb(150, 150, 50)' }}>
						Your Coins: {yourCoins}
					</h4>
					<Select
						control={control}
						name='bottomScorer.bet'
						label='Who will score the least?'
						disabled={betsClosed || notBetting.bottomScorer}
						rules={{ required: !notBetting.bottomScorer }}
					>
						{match.blue1 && <MenuItem value={match.blue1}>{match.blue1}</MenuItem>}
						{match.blue2 && <MenuItem value={match.blue1}>{match.blue2}</MenuItem>}
						{match.blue3 && <MenuItem value={match.blue1}>{match.blue3}</MenuItem>}
						{match.red1 && <MenuItem value={match.red1}>{match.red1}</MenuItem>}
						{match.red2 && <MenuItem value={match.red2}>{match.red2}</MenuItem>}
						{match.red3 && <MenuItem value={match.red3}>{match.red3}</MenuItem>}
					</Select>
					<TextInput
						control={control}
						type='number'
						name='bottomScorer.amount'
						label='Amount to Bet'
						disabled={betsClosed || notBetting.bottomScorer}
						rules={{ required: !notBetting.bottomScorer, min: 1 }}
					/>
					<FormControlLabel
						label='Not Betting on This Section'
						control={
							<Checkbox
								onChange={(e) =>
									setNotBetting((prev) => ({
										...prev,
										bottomScorer: e.target.checked,
									}))
								}
								sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
								checked={notBetting.bottomScorer}
								disabled={betsClosed}
								defaultChecked={false}
							/>
						}
					/>
				</FormSection>
				<SubmitButton disabled={betsClosed}>Submit Bets</SubmitButton>
				<p>After you submit your bets you will not be able to change them.</p>
			</Form>
		</>
	);
};

export default BetsForm;
