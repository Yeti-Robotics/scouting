import { Group } from '@mantine/core';
import { ReactNode } from 'react';


const FlexGrid = ({ children, maxWidth }: { maxWidth?: number; children: ReactNode }) => {
	return <Group style={{ maxWidth }}>{children}</Group>;
};

export default FlexGrid;
