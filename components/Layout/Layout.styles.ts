import styled from '@emotion/styled';

export const MainContainer = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: center;
	margin: 4rem 0 20px 0;
	position: relative;
	bottom: 100%;
	flex-grow: 1;
	width: 100%;
`;

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: ${({ theme }) => theme.palette.background.default};
	color: ${({ theme }) => theme.palette.text.primary};
	transition: background-color 0.3s ease;
`;
