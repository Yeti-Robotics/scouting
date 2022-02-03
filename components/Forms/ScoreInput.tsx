import { Box, Button, SxProps, TextField, Theme } from '@mui/material';
import { ChangeEvent } from 'react';
import { Control, Controller, ControllerProps, ControllerRenderProps } from 'react-hook-form';
import { addRequired } from './formHelpers';

interface Props {
	control: Control<any>;
	name: string;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	disabled?: boolean;
}

const defaultSx: SxProps<Theme> = {
	color: 'palette.action.hover',
	borderRadius: 0,
};

const defaultInputSx: SxProps<Theme> = {
	width: '100%',
};

const increment = (field: ControllerRenderProps) => {
	field.onChange(field.value + 1);
};

const decrement = (field: ControllerRenderProps) => {
	if (field.value != 0) field.onChange(field.value - 1);
};

const ScoreInput: React.VFC<Props> = ({
	name,
	control,
	rules,
	onChange = (e) => {},
	label,
	disabled,
}) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				m: 1,
				width: '100%',
			}}
		>
			<Box sx={{ color: 'palette.text.secondary' }}>
				{label ? addRequired(rules?.required, label) : addRequired(rules?.required, name)}
			</Box>
			<Box sx={{ display: 'flex', width: '100%' }}>
				<Controller
					name={name}
					defaultValue={0}
					control={control}
					rules={{ required: true, ...rules }}
					render={({ field, fieldState: { error } }) => (
						<>
							<Button
								sx={{
									fontSize: '16px',
									fontWeight: 'bold',
									position: 'relative',
									left: 1,
									borderTopRightRadius: 0,
									borderBottomRightRadius: 0,
								}}
								onClick={() => decrement(field)}
								variant='contained'
								disabled={disabled}
							>
								-
							</Button>
							<TextField
								type='number'
								sx={{ defaultSx, ...defaultInputSx }}
								inputRef={field.ref}
								name={field.name}
								onChange={(e) => {
									field.onChange(e);
									onChange(e); // from props
								}}
								onBlur={field.onBlur}
								value={field.value}
								disabled={true}
								error={Boolean(error)}
							/>
							<Button
								sx={{
									fontSize: '16px',
									fontWeight: 'bold',
									position: 'relative',
									right: 1,
									borderTopLeftRadius: 0,
									borderBottomLeftRadius: 0,
								}}
								onClick={() => increment(field)}
								variant='contained'
								disabled={disabled}
							>
								+
							</Button>
						</>
					)}
				/>
			</Box>
		</Box>
	);
};

export default ScoreInput;
