import { NumberInput, NumberInputProps } from '@mantine/core';
import { Control, useController, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
} & NumberInputProps;

export const ControlledNumberInput = <T extends FieldValues>({
	control,
	name,
	onChange,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({
		control,
		name,
		rules: { required: props.required },
	});

	return (
		<NumberInput
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
