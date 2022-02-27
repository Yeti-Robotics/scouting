import { Box } from '@mui/material';

interface Props {
	title?: string;
	color?: string;
}

const FormSection: React.FC<Props> = ({ title, color, children }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '95%',
				m: 2,
			}}
		>
			{title && (
				<Box
					sx={{
						width: '100%',
						fontSize: '1.75rem',
						fontWeight: 'bold',
						backgroundColor: color || 'primary.main',
						padding: 1,
						border: '1px solid #fff',
						borderColor: color || 'primary.main',
						borderTopLeftRadius: '8px',
						borderTopRightRadius: '8px',
						borderBottom: '0px',
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
					flexGrow: 1,
					padding: 1,
					border: '1px solid #fff',
					borderTop: '0px',
					borderColor: color || 'primary.main',
					borderBottomLeftRadius: '8px',
					borderBottomRightRadius: '8px',
				}}
			>
				{children}
			</Box>
		</Box>
	);
};

export default FormSection;
