import {
	Input,
	SegmentedControl,
	SegmentedControlItem,
	SegmentedControlProps,
} from '@mantine/core';
import { Control, useController, FieldValues, Path, UseControllerProps } from 'react-hook-form';

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	data: SegmentedControlItem[];
	rules: UseControllerProps<T>['rules'];
	label?: string;
} & Omit<SegmentedControlProps, 'name'>;

export const ControlledSegmentedControl = <T extends FieldValues>({
	name,
	control,
	data,
	onChange,
	label,
	rules,
	...props
}: Props<T>) => {
	const { field } = useController({ control, name, rules });

	return (
		<Input.Wrapper label={label}>
			<SegmentedControl
				{...props}
				data={data}
				name={field.name}
				onBlur={field.onBlur}
				value={field.value}
				ref={field.ref}
				onChange={(e) => {
					field.onChange(e);
					onChange?.(e); // from props
				}}
			/>
		</Input.Wrapper>
	);
};
