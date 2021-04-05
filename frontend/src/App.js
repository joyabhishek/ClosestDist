import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(){
    super()
    this.state = {
      msg:"Waiting..."
    }
  }

  componentDidMount(){
    fetch("/hello", {
        "method": "POST",
        "headers":{
            "content_type":"application/json",
        },
        "body": JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      })
    .then(response => response.json())
    .then(output => {
        console.log(output)
      this.setState({
        msg: output.Reasponse
      })
    })
    .catch(e => console.log(e))
}

  render(){
    return (
      this.state.msg
      );
  }
}

export default App;
