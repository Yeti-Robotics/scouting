import { endPosToString } from '@/lib/mode';
import { TeamData } from '@/models/aggregations/teamData';
import styled from '@emotion/styled';
import Section from '../Section';

interface Props {
	team: TeamData;
}

const DataSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	h2 {
		margin: 0;
		text-decoration: underline;
	}
`;

const DataWrapper = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	width: 100%;

	h4 {
		margin: 1rem;
	}
`;

const percentOptions = { maximumFractionDigits: 2, style: 'percent' };

const TeamStats: React.VFC<Props> = ({ team }) => {
	return (
		<Section title='Team Stats'>
			<DataSection>
				<h2>Auto Data</h2>
				<DataWrapper>
					<h4>Avg. Score*: {team.avgAutoScore?.toFixed(2)}</h4>
					<h4>
						Avg. Upper Accuracy:{' '}
						{Number(team.avgUpperAuto / 100).toLocaleString(undefined, percentOptions)}
					</h4>
					<h4>
						Avg. Low Accuracy:{' '}
						{Number(team.avgLowerAuto / 100).toLocaleString(undefined, percentOptions)}
					</h4>
				</DataWrapper>
				<h2>Teleop Data</h2>
				<DataWrapper>
					<h4>Avg. Score*: {team.avgTeleopScore?.toFixed(2)}</h4>
					<h4>
						Avg. Upper Accuracy:{' '}
						{Number(team.avgUpperTeleop / 100).toLocaleString(
							undefined,
							percentOptions,
						)}
					</h4>
					<h4>
						Avg. Low Accuracy:{' '}
						{Number(team.avgLowerTeleop / 100).toLocaleString(
							undefined,
							percentOptions,
						)}
					</h4>
				</DataWrapper>
				<h2>Other Data</h2>
				<DataWrapper>
					<h4>Avg. # of Penalties**: {team.avgPenalties?.toFixed(2)}</h4>
					<h4>Avg. Defense Rating (1-5): {team.avgDefense?.toFixed(2)}</h4>
					<h4>Most Common End Position: {endPosToString(team.endPosition)}</h4>
				</DataWrapper>
			</DataSection>
			<p>* Assumes data is accurate and does not include climbing points</p>
			<p>** Assumes data is accurate</p>
		</Section>
	);
};

export default TeamStats;
