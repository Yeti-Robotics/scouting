import { MultiSelect, MultiSelectProps, SelectItem } from '@mantine/core';
import { Control, useController, FieldValues, Path, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	data: (string | SelectItem)[];
	rules?: UseControllerProps<T>['rules'];
} & MultiSelectProps;

export const ControlledMultiSelect = <T extends FieldValues>({
	name,
	control,
	data,
	onChange,
	rules,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({ control, name, rules });

	return (
		<MultiSelect
			{...props}
			data={data}
			name={field.name}
			onBlur={field.onBlur}
			value={field.value}
			error={fieldState.error?.message}
			ref={field.ref}
			onChange={(e) => {
				field.onChange(e);
				onChange?.(e); // from props
			}}
		/>
	);
};
