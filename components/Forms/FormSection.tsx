import { Paper, Stack, Title } from '@mantine/core';
import { ReactNode } from 'react';

interface Props {
	title?: string;
	color?: string;
	children: ReactNode;
}

const FormSection = ({ title, color, children }: Props) => {
	return (
		<Paper
			withBorder
			shadow='xl'
			p='md'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{title && (
				<Title
					sx={{
						width: '100%',
						fontSize: '1.75rem',
						fontWeight: 'bold',
						backgroundColor: color || 'primary.main',
					}}
				>
					{title}
				</Title>
			)}
			<Stack align='center'>{children}</Stack>
		</Paper>
	);
};

export default FormSection;
