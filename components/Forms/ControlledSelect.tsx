import { Select, SelectItem, SelectProps } from '@mantine/core';
import { Control, useController, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	data: SelectItem;
} & SelectProps;

export const ControlledSelect = <T extends FieldValues>({
	name,
	control,
	data,
	onChange,
	...props
}: Props<T>) => {
	const { field, fieldState } = useController({ control, name });

	return (
		<Select
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
			{...props}
		/>
	);
};
