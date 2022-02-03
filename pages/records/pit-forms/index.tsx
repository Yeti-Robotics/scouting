import Layout from '@/components/Layout';
import Paginator from '@/components/Paginator';
import PitFormDisplay from '@/components/Paginator/PitForms/PitFormDisplay';
import PitFormFilter from '@/components/Paginator/PitForms/PitFormFilter';
import { PitFormI } from '@/models/PitForm';

const StandForms = () => {
	return (
		<Layout>
			<Paginator
				object={{} as PitFormI}
				route='/api/forms/pit'
				Filter={PitFormFilter}
				Display={PitFormDisplay}
			/>
		</Layout>
	);
};

export default StandForms;
