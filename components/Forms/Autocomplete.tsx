import { SxProps, Theme, TextField, Autocomplete as MuiAutocomplete, Box } from '@mui/material';
import { Control, Controller, ControllerProps, ControllerRenderProps } from 'react-hook-form';
import { addRequired } from './formHelpers';
import { SyntheticEvent, useRef } from 'react';

type AutocompleteOnChange = (
	event: SyntheticEvent<Element, Event>,
	value: any,
	reason: any,
) => void;

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
	freeSolo?: boolean;
	valueAsNumber?: boolean;
	options: string[] | { [key: string]: any; label: string }[];
}

const defaultSx: SxProps<Theme> = {
	color: 'text.primary',
};

const defaultInputSx: SxProps<Theme> = {
	width: '100%',
};

const Autocomplete: React.VFC<Props> = ({
	name,
	control,
	rules,
	onChange = () => {},
	placeholder,
	getOptionLabel = (opt) => opt?.label ?? String(opt),
	isOptionEqualToValue = (option, value) => option === value,
	label,
	options,
	type,
	defaultValue,
	sx,
	disabled,
	freeSolo,
	valueAsNumber,
}) => {
	const lastValue = useRef(defaultValue);

	const updateValue = (field: ControllerRenderProps<any, string>): AutocompleteOnChange =>
		valueAsNumber
			? (e, v) => {
					const parsed = parseFloat(v?.value ?? v);
					if (!isNaN(parsed)) {
						field.onChange(parsed);
						lastValue.current = parsed;
					} else if (v === '') {
						field.onChange('');
						lastValue.current = '';
					} else {
						field.onChange(lastValue.current);
					}
					onChange(e); // from props
			  }
			: (e, v) => {
					console.log(v);
					field.onChange(v?.value ?? v);
					onChange(e); // from props
			  };

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
					<MuiAutocomplete
						freeSolo={freeSolo}
						options={options}
						sx={{ ...defaultSx, ...defaultInputSx, ...sx }}
						getOptionLabel={getOptionLabel}
						onBlur={field.onBlur}
						value={field.value}
						isOptionEqualToValue={isOptionEqualToValue}
						onChange={updateValue(field)}
						onInputChange={freeSolo ? updateValue(field) : undefined}
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

export default Autocomplete;
