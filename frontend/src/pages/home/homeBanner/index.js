import { Carousel, WingBlank } from 'antd-mobile';
import React, { Component } from 'react'

export default class HomeBanner extends Component {
  state = {
    data: [],
    imgHeight: 176,
  }
  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['i3/2053469401/O1CN01Kikmmn2JJhzohwzEG_!!2053469401', 'i2/2053469401/O1CN01oF8rim2JJhzygy77j_!!2053469401','i1/2053469401/O1CN01mx2gne2JJi020KaXA_!!2053469401'],
      });
    }, 100);
  }
  render() {
    return (
      <WingBlank>
        <Carousel
          autoplay={true}
          infinite={true}
          autoplayInterval="4000"
          dotStyle={{background:'rgba(255,255,255,.4)'}}
          dotActiveStyle={{background:'#fff'}}
          // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          // afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(val => (
            <a key={val} href="/home" style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}>
              <img
                src={`https://img.alicdn.com/imgextra/${val}.jpg`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
      </WingBlank>
    );
  }
}
