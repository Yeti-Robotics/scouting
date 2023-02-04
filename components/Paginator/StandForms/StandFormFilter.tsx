import Checkbox from '@/components/Forms/Checkbox';
import Select from '@/components/Forms/ControlledSelect';
import SubmitButton from '@/components/Forms/SubmitButton';
import TextInput from '@/components/Forms/TextInput';
import { StandFormI } from '@/models/StandForm';
import { Button, MenuItem } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FilterForm } from '../Filter.styles';
import { sanitizeFilter, validateIsNumber } from '../filterHelpers';
import { FilterProps } from '../Paginator';

type Spread<T extends object> = T[keyof T];

const StandFormFilter: React.VFC<FilterProps<StandFormI>> = ({ state }) => {
	const [query, setQuery] = state;
	const {
		control,
		handleSubmit,
		watch,
		reset: resetForm,
	} = useForm({
		defaultValues: {
			...query.filter,
			sortBy: Object.keys(query.sort)[0],
			sortFrom: (query.sort as { [key: string]: Spread<StandFormI> })[
				Object.keys(query.sort)[0]
			],
		},
	});
	const sortBy = watch('sortBy');

	const onSubmit: SubmitHandler<
		Partial<StandFormI> & { sortBy: string; sortFrom: Spread<StandFormI> }
	> = (data) => {
		const { sortBy, sortFrom, ...filter } = sanitizeFilter(data);
		const newSort: any = {};
		newSort[sortBy] = sortFrom;
		setQuery({ filter, sort: newSort });
	};

	const reset = () => {
		setQuery({ filter: {}, sort: { createdAt: -1 } });
		resetForm();
	};

	return (
		<FilterForm onSubmit={handleSubmit(onSubmit)}>
			<h1>Sort</h1>
			<Select control={control} name='sortBy' label='Sort By' defaultValue='createdAt'>
				<MenuItem defaultChecked value='createdAt'>
					Submission Time
				</MenuItem>
				<MenuItem value='_id'>id</MenuItem>
			</Select>
			<Select control={control} name='sortFrom' label='Sort From' defaultValue={-1}>
				<MenuItem value={1}>
					{sortBy === 'createdAt' || sortBy === 'updatedAt'
						? 'most recent to least recent'
						: 'low to high'}
				</MenuItem>
				<MenuItem defaultChecked value={-1}>
					{sortBy === 'createdAt' || sortBy === 'updatedAt'
						? 'least recent to most recent'
						: 'high to low'}
				</MenuItem>
			</Select>
			<h1>Filter</h1>
			<Checkbox
				control={control}
				name='approved'
				label='Approved'
				rules={{ validate: undefined }}
			/>
			<TextInput
				control={control}
				name='matchNumber'
				label='Match Number'
				rules={{ validate: validateIsNumber, required: false }}
			/>
			<TextInput
				control={control}
				name='teamNumber'
				label='Team Number'
				rules={{ validate: validateIsNumber, required: false }}
			/>
			<TextInput
				control={control}
				name='scouter.firstName'
				label='Scouter First Name'
				rules={{ validate: () => true, required: false }}
			/>
			<TextInput
				control={control}
				name='scouter.lastName'
				label='Scouter Last Name'
				rules={{ validate: () => true, required: false }}
			/>
			<Button variant='contained' onClick={reset} sx={{ mb: 2 }}>
				Reset Filters
			</Button>
			<SubmitButton>Update</SubmitButton>
		</FilterForm>
	);
};

export default StandFormFilter;
