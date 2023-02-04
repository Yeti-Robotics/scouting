import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@mantine/core';
import { Control, useController, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	data: AutocompleteItem;
} & AutocompleteProps;

export const ControlledAutocomplete = <T extends FieldValues>({
	control,
	name,
	data,
	onChange,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({
		control,
		name,
		rules: { required: props.required },
	});

	return (
		<Autocomplete
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
			{...props}
		/>
	);
};
