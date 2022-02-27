import { Box, SxProps, TextField, Theme } from '@mui/material';
import { ChangeEvent, useRef } from 'react';
import { Control, Controller, ControllerProps } from 'react-hook-form';
import { addRequired } from './formHelpers';

interface Props {
	control: Control<any>;
	name: string;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	placeholder?: string;
	type?: JSX.IntrinsicElements['input']['type'];
	defaultValue?: any;
	sx?: SxProps<Theme>;
	disabled?: boolean;
	valueAsNumber?: boolean;
}

const defaultSx: SxProps<Theme> = {
	color: 'text.primary',
};

const defaultInputSx: SxProps<Theme> = {
	width: '100%',
};

const TextInput: React.VFC<Props> = ({
	name,
	control,
	rules,
	onChange = (e) => {},
	placeholder,
	label,
	type,
	defaultValue,
	sx,
	disabled,
	valueAsNumber,
}) => {
	const lastValue = useRef(defaultValue);

	return (
		<Box sx={{ m: 1, width: '100%' }}>
			<Controller
				name={name}
				defaultValue={defaultValue || ''}
				control={control}
				rules={{
					validate: valueAsNumber
						? (v) => !isNaN(parseFloat(v)) || !isNaN(parseInt(v))
						: (v) => v !== '',
					...rules,
				}}
				render={({ field, fieldState: { error } }) => (
					<TextField
						type={type}
						sx={{ ...defaultSx, ...defaultInputSx, ...sx }}
						InputLabelProps={{ sx: defaultSx }}
						label={
							label
								? placeholder
									? addRequired(rules?.required, placeholder)
									: addRequired(rules?.required, label)
								: addRequired(rules?.required, name)
						}
						placeholder={placeholder || label || name}
						name={field.name}
						onChange={
							valueAsNumber
								? (e) => {
										const parsed = parseFloat(e.target.value);
										if (!isNaN(parsed)) {
											field.onChange(parsed);
											lastValue.current = parsed;
										} else if (e.target.value === '') {
											field.onChange('');
											lastValue.current = '';
										} else {
											field.onChange(lastValue.current);
										}
										onChange(e); // from props
								  }
								: (e) => {
										field.onChange(e);
										onChange(e); // from props
								  }
						}
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

export default TextInput;
