import styled from '@emotion/styled';

export const PaginatorWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-flow: row wrap;
	width: 100%;
`;

export const ResultsDisplay = styled.div`
	display: flex;
	height: calc(100vh - 4rem - 107px);
	flex-flow: row wrap;
	overflow: auto;
	flex-grow: 1;
	width: 500px;
	justify-content: center;
	border: 2px solid ${({ theme }) => theme.palette.text.primary};
`;

export const FilterWrapper = styled.div`
	height: calc(100vh - 4rem - 107px);
	padding: ${({ theme }) => theme.spacing(2)};
	border: 2px solid ${({ theme }) => theme.palette.text.primary};
	border-right: 0;
	border-bottom: 2px solid ${({ theme }) => theme.palette.text.primary};
	overflow: auto;

	@media (max-width: 500px) {
		border-right: 2px solid ${({ theme }) => theme.palette.text.primary};
		border-bottom: 0;
	}
`;
