import React, { Component,Fragment } from 'react'
import {Link,withRouter} from 'react-router-dom'
import './index.scss'
import Slider from './Slider'
import request from '../../actions/request'

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: []
    };
  }

  componentDidMount() {
    request({
      url: "/index.php",
      params: {
        r: "class/category",
        type: 1
      }
    }).then(res=>{
      res.data.data.data.map(item=>{
        return item.title=item.name;
      })

      this.setState({
        lists: res.data.data.data
      })
    });
  }

  render() {
    return (
      <Fragment>
        <div className="category_search tab">
          <i className="fa fa-angle-left" onClick={()=>{this.props.history.goBack()}}></i>
          <Link to="/search" className="searchLink">
            <i className="fas fa-search"></i>
            <input placeholder="请输入您想要的商品"/>
          </Link>
        </div>
        <div className="container category_content">
          <Slider lists={this.state.lists}></Slider>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(Category)