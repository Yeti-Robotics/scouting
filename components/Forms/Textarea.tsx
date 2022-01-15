import { Box, SxProps, TextField, Theme } from '@mui/material';
import { ChangeEvent } from 'react';
import { Control, Controller, ControllerProps } from 'react-hook-form';

interface Props {
	control: Control<any>;
	name: string;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	placeholder?: string;
	defaultValue?: any;
	sx?: SxProps<Theme>;
	disabled?: boolean;
}

const defaultSx: SxProps<Theme> = {
	color: 'text.primary',
};

const Textarea: React.VFC<Props> = ({
	name,
	control,
	rules,
	onChange = (e) => {},
	placeholder,
	label,
	defaultValue,
	sx,
	disabled,
}) => {
	return (
		<Box sx={{ m: 1 }}>
			<Controller
				name={name}
				defaultValue={defaultValue}
				control={control}
				rules={rules}
				render={({ field, fieldState: { error } }) => (
					<TextField
						multiline
						sx={{ ...defaultSx, ...sx }}
						InputLabelProps={{ sx: defaultSx }}
						label={label || placeholder || name}
						placeholder={placeholder || label || name}
						ref={field.ref}
						name={field.name}
						onChange={(e) => {
							field.onChange(e);
							onChange(e); // from props
						}}
						onBlur={field.onBlur}
						value={field.value}
						disabled={disabled}
						error={Boolean(error)}
					/>
				)}
			/>
		</Box>
	);
};

export default Textarea;
