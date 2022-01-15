import { StandFormI } from '@/models/StandForm';
import { SubmitHandler } from 'react-hook-form';

const onCreate: SubmitHandler<StandFormI> = (data, e) => {
	console.log(data);
};

const onUpdate: SubmitHandler<StandFormI> = (data, e) => {
	console.log(data);
};

// returns dif function depending on whether the form is for updating or creation
export const onSubmit: (create: boolean) => SubmitHandler<StandFormI> = (create) =>
	create ? onCreate : onUpdate;
