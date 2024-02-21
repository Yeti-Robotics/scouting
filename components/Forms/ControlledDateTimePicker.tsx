import { DateTimePicker } from '@mantine/dates';
import { DateTimePickerProps } from '@mantine/dates';
import dayjs from 'dayjs';
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
			placeholder={undefined}
			{...props}
			name={field.name}
			onBlur={field.onBlur}
			value={typeof field.value === 'string' ? dayjs(field.value).toDate() : field.value}
			error={fieldState.error?.message}
			ref={field.ref}
			onChange={(v) => {
				field.onChange(
					valueAsString
						? typeof v?.toISOString === 'function'
							? v.toISOString()
							: undefined
						: v,
				);
				onChange?.(v);
			}}
		/>
	);
};
