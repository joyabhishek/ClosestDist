import React from 'react';

function CsvFilePath(props){
    return(
        <div className="provideCSV">
            <label>Provide the CSV here</label>
            <input type="text" name="csvFilePath" value={props.csvFilePath} onChange={props.handleChange}/>
            <button onClick={props.readCSVButtonClick}>Lets Go</button>
            {props.msg? <p>{props.msg}</p> : null}
        </div>
    )
}

export default CsvFilePath