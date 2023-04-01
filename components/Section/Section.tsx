import { IconChevronDown } from '@tabler/icons-react';
import { ActionIcon, Card, Collapse, Group, Stack, Title } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
	expanded?: boolean;
	title: string;
	children: ReactNode;
}

const Section = ({ title, expanded = true, children }: Props) => {
	const [isExpanded, setIsExpanded] = useState(expanded);

	useEffect(() => setIsExpanded(expanded), [expanded]);

	return (
		<Card withBorder shadow='xl' w='100%'>
			<Stack>
				<Group>
					<Title>{title}</Title>
					<ActionIcon
						variant='subtle'
						onClick={() => setIsExpanded((prev) => !prev)}
						size={48}
					>
						<IconChevronDown
							size={48}
							style={{
								transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
								transition: 'transform 0.15s ease',
							}}
						/>
					</ActionIcon>
				</Group>

				<Collapse in={isExpanded} sx={{ width: '100%' }}>
					<Stack>{children}</Stack>
				</Collapse>
			</Stack>
		</Card>
	);
};

export default Section;
