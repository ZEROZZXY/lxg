import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import './index.scss'

export const Tab = (info) =>{
  class TabComponent extends Component{
    back=()=>{
      this.props.history.goBack()
    }
    render() {
      return (
        <div className="tab">
          <i className="fa fa-angle-left" onClick={this.back}></i>
          <span>{info}</span>
        </div>
      )
    }
  }
  return withRouter(TabComponent)
}

