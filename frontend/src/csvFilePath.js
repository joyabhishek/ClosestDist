import React from 'react';

function CsvFilePath(props){
    return(
        <div className="provideCSV">
            {props.msg? <p>{props.msg}</p> : null}
            <label>Provide the CSV here</label>
            <input type="text" name="csvFilePath" value={props.csvFilePath} onChange={props.handleChange}/>
            <button onClick={props.readCSVButtonClick}>Lets Go</button>
            
        </div>
    )
}

export default CsvFilePath