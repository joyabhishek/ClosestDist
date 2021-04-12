import React from 'react';

function ShowTableResult(props){
    console.log(typeof props.tableResult)
    let tableDataHtml = props.tableResult.map(res => {
        return(<tr>
                <td>{res['Distribution']}</td>
                <td>{res['chi_square']}</td>            
                </tr>)
    })

    return(
        <div className="results">
            <label for="">Results</label>
            <table>
                <tr>
                <th>Distribution</th>
                <th>chi_square</th>                
                </tr>
                {tableDataHtml}
            </table>
        </div>
    )

}

export default ShowTableResult