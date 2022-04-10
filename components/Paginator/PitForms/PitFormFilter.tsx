import Select from '@/components/Forms/Select';
import SubmitButton from '@/components/Forms/SubmitButton';
import TextInput from '@/components/Forms/TextInput';
import { PitFormI } from '@/models/PitForm';
import { Button, MenuItem } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FilterForm } from '../Filter.styles';
import { sanitizeFilter, validateIsNumber } from '../filterHelpers';
import { FilterProps } from '../Paginator';

type Spread<T extends object> = T[keyof T];

const PitFormFilter: React.VFC<FilterProps<PitFormI>> = ({ state }) => {
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
			sortFrom: (query.sort as { [key: string]: Spread<PitFormI> })[
				Object.keys(query.sort)[0]
			],
		},
	});
	const sortBy = watch('sortBy');

	const onSubmit: SubmitHandler<
		Partial<PitFormI> & { sortBy: string; sortFrom: Spread<PitFormI> }
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
			<TextInput
				control={control}
				name='teamNumber'
				label='Team Number'
				rules={{ validate: validateIsNumber, required: false }}
			/>
			<TextInput
				control={control}
				name='scouter'
				label='Scouter Username'
				rules={{ validate: () => true, required: false }}
			/>
			<Button variant='contained' onClick={reset} sx={{ mb: 2 }}>
				Reset Filters
			</Button>
			<SubmitButton>Update</SubmitButton>
		</FilterForm>
	);
};

export default PitFormFilter;
