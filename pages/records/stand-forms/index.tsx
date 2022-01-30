import Layout from '@/components/Layout';
import Paginator from '@/components/Paginator';
import StandFormDisplay from '@/components/Paginator/StandForms/StandFormDisplay';
import StandFormFilter from '@/components/Paginator/StandForms/StandFormFilter';
import { StandFormI } from '@/models/StandForm';

const StandForms = () => {
	return (
		<Layout>
			<Paginator
				object={{} as StandFormI}
				route='/api/forms/stand'
				Filter={StandFormFilter}
				Display={StandFormDisplay}
			/>
		</Layout>
	);
};

export default StandForms;
