import { Autocomplete, AutocompleteProps } from '@mantine/core';
import { Control, useController, FieldValues, Path, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	rules?: UseControllerProps<T>['rules'];
} & AutocompleteProps;

export const ControlledAutocomplete = <T extends FieldValues>({
	control,
	name,
	data,
	onChange,
	rules,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({
		control,
		name,
		rules: { required: props.required, ...rules },
	});

	return (
		<Autocomplete
			{...props}
			data={data}
			name={field.name}
			onBlur={field.onBlur}
			value={field.value}
			error={fieldState.error?.message}
			ref={field.ref}
			onChange={(e) => {
				field.onChange(e);
				onChange?.(e);
			}}
		/>
	);
};
