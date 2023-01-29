import styled from '@emotion/styled';
import { ReactNode } from 'react';

const Styles = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	max-width: 1000px;
`;

const FlexGrid = ({ children, maxWidth }: { maxWidth?: number; children: ReactNode }) => {
	return <Styles style={{ maxWidth }}>{children}</Styles>;
};

export default FlexGrid;
