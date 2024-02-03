import StandForm from "@/models/StandForm"
import { avgDataPipeline } from "@/models/aggregations/averageData"
import { firstPickWeights, secondPickWeights } from "./weights"
import PickListTable from "./PickabilityTable"

function computeTeamPickability(team, weights) {
    return Object.keys(weights).reduce((prev, key) => {
        if (key === "climbRate") {
            return prev + team.climbSuccess * weights.climbRate / team.forms
        }
        else {
            return prev + team[key] * weights[key]
        }
    }, 0)
}

export default async function PickList() {
    const averages = await StandForm.aggregate(avgDataPipeline).then((res) => res.map(team => ({
        ...team,
        firstPickability: computeTeamPickability(team, firstPickWeights),
        secondPickability: computeTeamPickability(team, secondPickWeights)
    })).sort((b, a) => a.firstPickability - b.firstPickability))
    return <main>
        <PickListTable data={averages}/>
        
    </main>

}
