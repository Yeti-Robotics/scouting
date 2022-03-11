import { Button, SxProps, Theme } from '@mui/material';

interface Props {
	sx?: SxProps<Theme>;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent) => void;
}

const defaultSx: SxProps<Theme> = {};

const SubmitButton: React.FC<Props> = ({ children, disabled, onClick, sx }) => {
	return (
		<Button
			type='submit'
			variant='contained'
			disabled={disabled}
			onClick={onClick}
			sx={{ ...defaultSx, ...sx }}
		>
			{children}
		</Button>
	);
};

export default SubmitButton;
