import React from 'react';

function ShowColumnAndDist(props){
    let distHtml = props.dists.map(dist => {
        return ( <div className="radioInput"><input type="checkbox" name={dist} checked={props.selectedDists.includes(dist)} onChange={props.handleDists} />{dist}</div> )
    })

    let columnsHtml = props.columns.map(col => {
        return (<div className="radioInput"><input type="radio" name="selectedCol" value={col} checked={props.selectedCol === col} onChange={props.handleChange}/>{col}</div>)
    })
    
    return (
        <div>
            <div class="columns">
                {props.colDistMsg? <p>{props.colDistMsg}</p> : null}
                <label for="">Columns</label>             
                <input type="text" name="" id=""/>
                {columnsHtml}                           
            </div>
            <div class="columns">
            <label for="">Distributions</label>
            <input type="text" name="" id=""/>            
                {distHtml} 
            <button>Lets get results</button>
            </div>
        </div>
    )

}

export default ShowColumnAndDist