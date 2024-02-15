import StandForm from '@/models/StandForm';
import PickList from '@/models/PickList';
import PickListTable from '@/components/PicklistTable';
import { TeamAvgsI, PickabilityWeightsI } from '@/lib/types/Pickability';
import { avgDataPipeline } from '@/models/aggregations/averageData';
import { firstPickWeights, secondPickWeights } from '../../lib/analysis/pickability-weights';
import { connectToDbB } from '@/middleware/connect-db';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
  

export default async function PicklistPage() {
    await connectToDbB();
    const picklists = await PickList.find({});
    console.log(picklists)
    return 		<main className='mx-auto max-w-[540px]'>
   {picklists.map((picklist)=> {
    return <Card>
      <Card>
  <CardHeader>
    <CardTitle>{picklist.name}</CardTitle>
    <CardDescription>
      <p>Updated at: {picklist.updatedAt.toDateString()}</p>
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant="outline">View</Button>
  </CardContent>
</Card>

    </Card>
    
   })}
</main>
}