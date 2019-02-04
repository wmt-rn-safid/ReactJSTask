import React, { Component } from 'react';
// import logo from './logo.svg';
import '../Screen/App.css';
import {Quiz} from '../Components/Quiz'
import {Welcome} from '../Components/Welcome'


class App extends Component {
  constructor(props){
    super(props)
    this.state={
      fname:'',
      lname:"",
      WelcomeShow:true
    }
  }
  render() {
    return (
      <div className="App">
        {
          this.state.WelcomeShow ?
          <Welcome
          handleClick={(fname,lname)=>{
            this.setState({fname:fname,lname:lname})
            
            this.setState({WelcomeShow:false})
            
          }}
          />:
      <Quiz name={`${this.state.fname} ${this.state.lname}`}/>
        }
        
      
      </div>
    );
  }
}

export default App;
