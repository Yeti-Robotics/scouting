export default function PickListTable({data}) {
    return <table>
        <thead>
            <tr>
                <th>Number</th>
                <th>First Pickability</th>
                <th>Second Pickability</th>
            </tr>
        </thead>
    <tbody>
        {
            data.map(team=> <tr>
                <td>{team._id}</td>
                <td>{team.firstPickability}</td>
                <td>{team.secondPickability}</td>
            </tr>)
        }
    </tbody>
    </table>
}
