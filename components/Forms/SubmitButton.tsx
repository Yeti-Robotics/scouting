import { Button, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
	sx?: SxProps<Theme>;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	children: ReactNode;
}

const defaultSx: SxProps<Theme> = {};

const SubmitButton = ({ children, disabled, onClick, sx }: Props) => {
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
