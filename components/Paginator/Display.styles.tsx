import styled from '@emotion/styled';

export const DisplayContainer = styled.div`
	margin: ${({ theme }) => theme.spacing(1)};
	padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: ${({ theme }) => theme.palette.primary.main};
	flex-grow: 1;
`;

export const DisplayWrapper = styled.a`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-transform: none;
	width: 100%;
	margin: 1;
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	h3 {
		margin: 0;
	}
	h4 {
		margin: ${({ theme }) => theme.spacing(1)};
	}
`;
