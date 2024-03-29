import { NumberInput, NumberInputProps } from '@mantine/core';
import { Control, useController, FieldValues, Path, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	rules?: UseControllerProps<T>['rules'];
} & NumberInputProps;

export const ControlledNumberInput = <T extends FieldValues>({
	control,
	name,
	onChange,
	rules,
	max,
	min,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({
		control,
		name,
		rules: { required: props.required, max, min, ...rules },
	});

	return (
		<NumberInput
			{...props}
			name={field.name}
			onBlur={field.onBlur}
			value={field.value ?? ''}
			error={fieldState.error?.message}
			ref={field.ref}
			max={max}
			min={min}
			onChange={(e) => {
				field.onChange(e);
				onChange?.(e);
			}}
		/>
	);
};
