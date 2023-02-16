import { Box, Paper, Title } from '@mantine/core';
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
			<Box
				sx={{
					display: 'flex',
					width: '100%',
					flexDirection: 'column',
					alignItems: 'center',
					flexGrow: 1,
					padding: 1,
				}}
			>
				{children}
			</Box>
		</Paper>
	);
};

export default FormSection;
