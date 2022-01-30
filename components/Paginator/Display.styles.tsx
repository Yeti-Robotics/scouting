import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const DisplayContainer = styled.div`
	margin: ${({ theme }) => theme.spacing(1)};
	flex-grow: 1;
`;

export const DisplayWrapper: React.FC = ({ children }) => {
	return (
		<Button
			component='a'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				textTransform: 'none',
				h3: { margin: 0 },
				h4: { margin: 1 },
			}}
			variant='contained'
		>
			{children}
		</Button>
	);
};
