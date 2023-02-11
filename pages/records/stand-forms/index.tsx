import Paginator from '@/components/Paginator';
import StandFormDisplay from '@/components/Paginator/StandForms/StandFormDisplay';
import StandFormFilter from '@/components/Paginator/StandForms/StandFormFilter';
import { StandFormI } from '@/models/StandForm';

const StandForms = () => {
	return (
		<Paginator
			object={{} as StandFormI}
			route='/api/forms/stand'
			Filter={StandFormFilter}
			Display={StandFormDisplay}
		/>
	);
};

export default StandForms;
