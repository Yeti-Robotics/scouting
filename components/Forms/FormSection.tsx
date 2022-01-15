import { Box } from '@mui/material';

interface Props {
	title?: string;
}

const FormSection: React.FC<Props> = ({ title, children }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				border: '0.25rem solid #fff',
				borderColor: 'primary.main',
				borderRadius: '8px',
				padding: 0,
				borderSpacing: 0,
			}}
		>
			{title && (
				<Box
					sx={{
						width: '100%',
						fontSize: '2.5rem',
						fontWeight: 'bold',
						backgroundColor: 'primary.main',
						padding: 2,
						alignSelf: 'flex-start',
						border: 0,
					}}
				>
					{title}
				</Box>
			)}
			<Box
				sx={{
					display: 'flex',
					width: '100%',
					flexDirection: 'column',
					alignItems: 'center',
					border: 0,
					flexGrow: 1,
					padding: 1,
				}}
			>
				{children}
			</Box>
		</Box>
	);
};

export default FormSection;
