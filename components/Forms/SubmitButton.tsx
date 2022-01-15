import { Button, SxProps, Theme } from '@mui/material';

interface Props {
	sx?: SxProps<Theme>;
}

const defaultSx: SxProps<Theme> = {};

const SubmitButton: React.FC<Props> = ({ children, sx }) => {
	return (
		<Button type='submit' variant='contained' sx={{ ...defaultSx, ...sx }}>
			{children}
		</Button>
	);
};

export default SubmitButton;
