import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CsvFilePath from './csvFilePath';
import ShowColumnAndDist from "./showColumnsAndDist"

class App extends Component {

  constructor(){
    super()
    this.state = {
      readCSV : false,
      csvFilePath: "",
      columns: [],
      selectedCol:"",
      showedCols:[],
      searchCol:"",
      msg:"",
      dists:['weibull_min','norm','weibull_max','beta',
      'invgauss','uniform','gamma','expon', 'lognorm','pearson3','triang'],      
      showedDists:['weibull_min','norm','weibull_max','beta',
      'invgauss','uniform','gamma','expon', 'lognorm','pearson3','triang'],
      selectedDists: [],
      searchDist:"",      
      colDistMsg: null

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

  handleSearchTextBox = (type,e) => {
    var {name, value} = e.target
    if (type === "dist"){
      const reg = new RegExp(value, i)
      let showedDists = []
      if (value === ""){
        showedDists = [...this.state.dists]
      }else{
         for (var i in this.state.dists){
          if (this.state.dists[i].match(reg)){
            showedDists.push(this.state.dists[i])
          }          
        }
      }
      this.setState({
        showedDists: [...showedDists],
        [name]: value
      })
    }else if (type === "cols"){
      const reg = new RegExp(value, i)
      let showedCols = []
      if (value === ""){
        showedCols = [...this.state.columns]
      }else{
         for (var i in this.state.columns){
          if (this.state.columns[i].match(reg)){
            showedCols.push(this.state.columns[i])
          }          
        }
      }
      this.setState({
            showedCols: [...showedCols],
            [name]: value
          }
        )
    }
  }

  handleDists = (e) => {
    const {name} = e.target
    this.setState( prevState => {
      if (prevState.selectedDists.includes(name)){
        prevState.selectedDists.pop(name)
        return {selectedDists : [...prevState.selectedDists]}
      }else{
        return {selectedDists : [...prevState.selectedDists, name]}
      }
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
          showedCols: output.columns,
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
        {this.state.readCSV? 
          <ShowColumnAndDist 
          columns = {this.state.showedCols}
          dists = {this.state.showedDists}
          selectedCol = {this.state.selectedCol}
          handleDists = {this.handleDists}
          selectedDists = {this.state.selectedDists}
          handleChange = {this.handleChange}
          colDistMsg= {this.state.colDistMsg}
          searchCol={this.state.searchCol}
          searchDist={this.state.searchDist}
          handleSearchTextBox={this.handleSearchTextBox}
          />
          :
          null}
      </div>
      

    )
  }
}

export default App;
