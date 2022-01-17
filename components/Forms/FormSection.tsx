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
				justifyContent: 'center',
				border: '0.25rem solid #fff',
				borderColor: 'primary.main',
				borderRadius: '8px',
				width: '95%',
				m: 2,
				borderSpacing: 0,
			}}
		>
			{title && (
				<Box
					sx={{
						width: '100%',
						fontSize: '1.75rem',
						height: 'auto',
						fontWeight: 'bold',
						backgroundColor: 'primary.main',
						padding: 1,
						alignSelf: 'flex-start',
						border: '0.25rem solid #fff',
						borderColor: 'primary.main',
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
