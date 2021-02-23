import React, { Component } from "react";
import {Link} from 'react-router-dom'

export default class ListContent extends Component {
  renderItem=()=>{
    return this.props.list.map(item=>{
      return(
        <li key={item.api_cid}>
          <Link to={{
            pathname:'/shopList',
            search:`cid=${item.api_cid}&name=${item.name}`
          }}>
            <img src={item.img} alt=""/>
            <span>{item.name}</span>
          </Link>
        </li>
      )
    })
  }

  render() {
    const { name } = this.props;
    return (
      <div className="list-item">
        <p className="item-title">{name}</p>
        <ul>
          {this.renderItem()}
        </ul>
      </div>
    );
  }
}
