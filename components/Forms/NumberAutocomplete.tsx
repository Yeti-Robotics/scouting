import { Autocomplete, AutocompleteProps } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useController, FieldValues, Path, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	data: (number | { label: string; value: number })[];
	onChange?: (v: number) => void;
	rules?: UseControllerProps<T>['rules'];
} & Omit<AutocompleteProps, 'data' | 'onChange'>;

export const NumberAutocomplete = <T extends FieldValues>({
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
	const normalizedData = useMemo(
		() =>
			data
				.map((n) =>
					typeof n === 'number'
						? { label: n.toString(), value: n.toString() }
						: { label: n.label, value: n.value.toString() },
				)
				.filter((data) => data.value !== undefined && data.value !== null),
		[data],
	);

	return (
		<Autocomplete
			{...props}
			data={normalizedData}
			name={field.name}
			onBlur={field.onBlur}
			value={field.value?.toString() ?? ''}
			error={fieldState.error?.message}
			ref={field.ref}
			onChange={(v) => {
				if (v === null || v === undefined || v === '') {
					field.onChange(undefined);
				}
				const parsed = v.includes('.') ? parseFloat(v) : parseInt(v);
				if (isNaN(parsed)) return console.log(`Failed to parse ${v} into a number.`);
				field.onChange(parsed);
				onChange?.(parsed); // from props
			}}
		/>
	);
};
