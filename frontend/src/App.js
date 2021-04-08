import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CsvFilePath from './csvFilePath';

class App extends Component {

  constructor(){
    super()
    this.state = {
      readCSV : false,
      csvFilePath: "",
      columns: [],
      msg:""
    }

    this.handleChange = this.handleChange.bind(this)
    this.readCSVButtonClick = this.readCSVButtonClick.bind(this)

  }

  handleChange(e){
    const {name, value} = e.target
    this.setState({
      [name] : value
    })
  }

  readCSVButtonClick(){
    if (this.state.csvFilePath.length === 0){
      this.setState({
        msg: "Please enter CSV file name",
        readCSV: false
      })
    }else{
      this.setState({
        msg: "Accessing ...",
      })
      fetch("/readCSV", {
        "method": "POST",
        "headers":{
            "content_type":"application/json",
        },
        "body": JSON.stringify({
          csvFilePath: this.state.csvFilePath
        })
      })
    .then(response => response.json())
    .then(output => {
        console.log(output)
      if (output.result){

        this.setState({
          msg: output.msg,
          columns: output.columns,
          readCSV : true
        })        

      }else{

        this.setState({
          msg: output.msg,
          readCSV : false
        })

      }
      
    })
    .catch(e => console.log(e))
    }

  }

  render(){
    return(
      <div className="container">
        <h2>Wanna know the distributions for data?</h2>
        <CsvFilePath 
          csvFilePath={this.state.csvFilePath}
          readCSVButtonClick={this.readCSVButtonClick}
          handleChange={this.handleChange}
          msg={this.state.msg}
          />
        {this.state.readCSV? <p>Show columns</p>: null}
      </div>
      

    )
  }
}

export default App;
