import { Select, SelectProps } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useController, FieldValues, Path, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	data: (number | { label: string; value: number })[];
	onChange?: (v: number) => void;
	rules?: UseControllerProps<T>['rules'];
} & Omit<SelectProps, 'name' | 'data' | 'onChange'>;

export const NumberSelect = <T extends FieldValues>({
	name,
	control,
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
						: { label: n.label, value: n.value?.toString() },
				)
				.filter((data) => data.value !== undefined && data.value !== null),
		[data],
	);

	return (
		<Select
			{...props}
			data={normalizedData}
			name={field.name}
			onBlur={field.onBlur}
			value={
				/* Must be string here so select can tell what was picked */
				field.value?.toString() ?? ''
			}
			error={fieldState.error?.message}
			ref={field.ref}
			onChange={(v) => {
				if (v === null || v === undefined) return;
				const parsed = v.includes('.') ? parseFloat(v) : parseInt(v);
				if (isNaN(parsed)) return console.log(`Failed to parse ${v} into a number.`);
				field.onChange(parsed);
				onChange?.(parsed); // from props
			}}
		/>
	);
};
