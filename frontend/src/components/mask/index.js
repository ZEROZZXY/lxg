import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import './index.scss'

class Mask extends Component {

  
  constructor(props) {
    super(props)
    this.state = {
       second:3
    }
  }

  componentDidMount(){
    if(this.props.location.pathname!=='/home'){
      this.setState({
        second:-1
      })
    }
    this.countDown()
  }

  countDown=()=>{
    setInterval(() => {
      this.setState({
        second:this.state.second-1
      })
    }, 1000);
  }

  skip=()=>{
    this.setState({
      second:-1
    })
  }

  render() {
    return (
      this.state.second>0?
      <div className="mask">
        <h1 className="logo">乐享购</h1>
        <p>快乐购物，享受购物</p>
        <div className="skip">
          <span onClick={this.skip}>跳过 </span>
          <em>{this.state.second}</em>s
        </div>
      </div>:null
    );
  }
}
export default withRouter(Mask)