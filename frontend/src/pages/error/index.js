import React, { Component } from 'react'
import './index.scss'
import {Link} from 'react-router-dom'

export default class Error extends Component {
  render() {
    return (
      <div className="container error-page">
        <img src="http://hbimg.b0.upaiyun.com/1c13ee6a90d57bee4f65543671144bb937b183ff2536-V3ZEl3_fw658" alt=""/>
        <Link to="/home">返回首页</Link>
      </div>
    )
  }
}
