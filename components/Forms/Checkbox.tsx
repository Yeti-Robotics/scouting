import { Box, Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { ChangeEvent } from 'react';
import { Control, Controller, ControllerProps } from 'react-hook-form';
import { addRequired } from './formHelpers';

interface Props {
	control: Control<any>;
	name: string;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	defaultValue?: boolean;
	size?: 'medium' | 'small';
	disabled?: boolean;
}

const Checkbox: React.VFC<Props> = ({
	name,
	control,
	rules,
	label,
	onChange = (e) => {},
	defaultValue,
	size,
	disabled,
}) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
			<Controller
				name={name}
				defaultValue={defaultValue || false}
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
