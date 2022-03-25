import { SxProps, Theme, TextField, Autocomplete as MuiAutocomplete, Box } from '@mui/material';
import { Control, Controller, ControllerProps } from 'react-hook-form';
import { addRequired } from './formHelpers';

interface Props {
	control: Control<any>;
	name: string;
	onChange?: (e: React.SyntheticEvent<Element>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	placeholder?: string;
	defaultValue?: any;
	getOptionLabel?: (option: any) => string;
	isOptionEqualToValue?: (option: any, value: any) => boolean;
	sx?: SxProps<Theme>;
	type?: JSX.IntrinsicElements['input']['type'];
	disabled?: boolean;
	options: string[] | { [key: string]: any; label: string }[];
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
	onChange = () => {},
	placeholder,
	getOptionLabel = (opt) => opt.label ?? opt,
	isOptionEqualToValue = (option, value) => option === value,
	label,
	options,
	type,
	defaultValue,
	sx,
	disabled,
}) => {
	return (
		<Box sx={{ m: 1, width: '100%' }}>
			<Controller
				name={name}
				defaultValue={defaultValue || ''}
				control={control}
				rules={{
					validate: (v) => v !== '',
					...rules,
				}}
				render={({ field, fieldState: { error } }) => (
					<MuiAutocomplete
						options={options}
						sx={{ ...defaultSx, ...defaultInputSx, ...sx }}
						getOptionLabel={getOptionLabel}
						onBlur={field.onBlur}
						value={field.value}
						isOptionEqualToValue={isOptionEqualToValue}
						onChange={(e, v) => {
							field.onChange(v);
							onChange(e); // from props
						}}
						disabled={disabled}
						renderInput={(params) => (
							<TextField
								{...params}
								type={type}
								InputLabelProps={{ sx: defaultSx }}
								label={
									label
										? placeholder
											? addRequired(rules?.required, placeholder)
											: addRequired(rules?.required, label)
										: addRequired(rules?.required, name)
								}
								sx={{ ...defaultInputSx }}
								inputProps={{ ...params.inputProps }}
								placeholder={placeholder || label || name}
								name={field.name}
								onBlur={field.onBlur}
								error={Boolean(error)}
							/>
						)}
					/>
				)}
			/>
		</Box>
	);
};

export default TextInput;
