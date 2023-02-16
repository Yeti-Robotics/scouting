import { DateTimePicker } from '@mantine/dates';
import { DateTimePickerProps } from '@mantine/dates';
import { Control, useController, FieldValues, Path, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	rules?: UseControllerProps<T>['rules'];
	valueAsString?: boolean;
} & DateTimePickerProps;

export const ControlledDateTimePicker = <T extends FieldValues>({
	control,
	name,
	onChange,
	rules,
	valueAsString,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({
		control,
		name,
		rules: { required: props.required, ...rules },
	});

	return (
		<DateTimePicker
			{...props}
			name={field.name}
			onBlur={field.onBlur}
			value={field.value}
			error={fieldState.error?.message}
			ref={field.ref}
			onChange={(v) => {
				field.onChange(valueAsString ? v?.toISOString() : v);
				onChange?.(v);
			}}
		/>
	);
};
