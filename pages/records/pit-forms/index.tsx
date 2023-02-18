import Paginator from '@/components/Paginator';
import PitFormDisplay from '@/components/Paginator/PitForms/PitFormDisplay';
import PitFormFilter from '@/components/Paginator/PitForms/PitFormFilter';
import { PitFormI } from '@/models/PitForm';

const StandForms = () => {
	return (
		<Paginator
			object={{} as PitFormI}
			route='/api/forms/pit'
			Filter={PitFormFilter}
			Display={PitFormDisplay}
		/>
	);
};

export default StandForms;
