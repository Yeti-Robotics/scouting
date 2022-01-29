import styled from '@emotion/styled';

const Styles = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	max-width: 1000px;
`;

const FlexGrid: React.FC<{ maxWidth?: number }> = ({ children, maxWidth }) => {
	return <Styles style={{ maxWidth }}>{children}</Styles>;
};

export default FlexGrid;
