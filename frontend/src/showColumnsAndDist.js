import React from 'react';

function ShowColumnAndDist(props){
    console.log(typeof props.dists)
    let distHtml = props.dists.map(dist => {
        return ( <div className="radioInput"><input type="checkbox" name={dist} checked={props.selectedDists.includes(dist)} onChange={props.handleDists} />{dist}</div> )
    })

    let columnsHtml = props.columns.map(col => {
        return (<div className="radioInput"><input type="radio" name="selectedCol" value={col} checked={props.selectedCol === col} onChange={props.handleChange}/>{col}</div>)
    })
    
    return (
        <div>
            <div className="columns">
                {props.colDistMsg? <p>{props.colDistMsg}</p> : null}
                <label for="">Columns</label>             
                <input type="text" name="searchCol" value={props.searchCol} onChange={(e) => {props.handleSearchTextBox("cols",e)}}/>
                    {columnsHtml}                           
            </div>
            <div className="columns">
                <label for="">Distributions</label>
                <input type="text" name="searchDist" value={props.searchDist} onChange={(e) => {props.handleSearchTextBox("dist",e)}}/>
                    {distHtml} 
                <button onClick={props.showResultsButtonClick}>Lets get results</button>
            </div>
        </div>
    )

}

export default ShowColumnAndDist