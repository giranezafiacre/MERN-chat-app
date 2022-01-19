import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {

    const [data, setData] = useState();

    const getData = async () => {
        try {
            const response = await axios.get("/messages/")
            console.log(response.data)
            setData(response.data)
        } catch (err) {
            console.log(err);
        }

    }

    useEffect(() => {
        getData();

    },[])

    const renderData = data ? data.map((item) => {
        const { _id, createdAt,sender,text,conversationId} = item;
        return (
            <>
                <tr key={_id} className="odd gradeX">
                    <td>{_id}</td>
                    <td>{createdAt}</td>
                    <td className="center">{sender}</td>
                    <td className="center">{text}</td>
                    <td className="center">{conversationId}
                    </td>
                </tr>
            </>
        );
    }) : () => <p>no message yet</p>

    return (

        <div className="row" style={{ 'marginTop': '5rem' }}>
            <div className="col-md-12">
                {/* <!-- Advanced Tables --> */}
                <div className="panel panel-default">
                    <div className="panel-heading" style={{ "display": "flex", "flexDirection": "row", "marginBottom": "10px" }}>
                        <h4 style={{ "textAlign": "center", "marginLeft": "40vw" }}>Messages List</h4>
                    </div>
                    <div className="panel-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered table-hover" style={{ 'width': '80vw', 'marginRight': '10vw', 'marginLeft': '10vw' }} id="dataTables-example">
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>created at</th>
                                        <th>sender</th>
                                        <th>text</th>
                                        <th>conversation ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderData}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    )
}
export default Dashboard