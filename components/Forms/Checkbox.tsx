import { Box, Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { ChangeEvent } from 'react';
import {
	Control,
	Controller,
	ControllerProps,
	FieldValues,
	Path,
	PathValue,
} from 'react-hook-form';
import { addRequired } from './formHelpers';

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	defaultValue?: boolean;
	size?: 'medium' | 'small';
	disabled?: boolean;
}

const Checkbox = <T extends FieldValues>({
	name,
	control,
	rules,
	label,
	onChange = () => {},
	defaultValue = false,
	size,
	disabled,
}: Props<T>) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
			<Controller
				name={name}
				defaultValue={defaultValue as PathValue<T, Path<T>>}
				control={control}
				rules={rules}
				render={({ field }) => (
					<FormControlLabel
						disabled={disabled}
						label={
							label
								? addRequired(rules?.required, label)
								: addRequired(rules?.required, name)
						}
						control={
							<MuiCheckbox
								name={field.name}
								onChange={(e) => {
									field.onChange(e);
									onChange(e); // from props
								}}
								inputRef={field.ref}
								sx={{ '& .MuiSvgIcon-root': { fontSize: 64 } }}
								onBlur={field.onBlur}
								checked={field.value}
								defaultChecked={defaultValue}
								size={size}
							/>
						}
					/>
				)}
			/>
		</Box>
	);
};

export default Checkbox;
