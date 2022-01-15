import { Box, MenuItem, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { Control, Controller, ControllerProps } from 'react-hook-form';

interface Props {
	control: Control<any>;
	name: string;
	onChange?: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	defaultValue?: any;
	disabled?: boolean;
}

const Select: React.FC<Props> = ({
	children,
	name,
	control,
	rules,
	label,
	onChange = (e) => {},
	defaultValue,
	disabled,
}) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
			<Controller
				name={name}
				defaultValue={defaultValue || ''}
				control={control}
				rules={{ validate: (v) => v !== '', ...rules }}
				render={({ field, fieldState: { error } }) => (
					<>
						<TextField
							select
							InputLabelProps={{ sx: { color: 'palette.text.primary' } }}
							label={label || name}
							name={field.name}
							onChange={(e) => {
								field.onChange(e);
								onChange(e); // from props
							}}
							sx={{ minWidth: 160 }}
							onBlur={field.onBlur}
							value={field.value}
							error={Boolean(error)}
							disabled={disabled}
						>
							{rules?.required && (
								<MenuItem disabled value=''>
									Select One
								</MenuItem>
							)}
							{children}
						</TextField>
					</>
				)}
			/>
		</Box>
	);
};

export default Select;
