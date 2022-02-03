import styled from '@emotion/styled';

export const DisplayContainer = styled.div`
	margin: ${({ theme }) => theme.spacing(1)};
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: ${({ theme }) => theme.palette.primary.main};
	flex-grow: 1;
`;

export const DisplayWrapper = styled.a`
	padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-transform: none;
	width: 100%;
	height: 100%;
	margin: 1;
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	h3 {
		margin: 0;
	}
	h4 {
		margin: ${({ theme }) => theme.spacing(1)};
	}
`;
