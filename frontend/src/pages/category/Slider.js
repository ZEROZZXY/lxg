import React from "react";
import { Tabs } from "antd-mobile";
import ListContent from "./ListContent";


export default class Slider extends React.Component {

  renderContent = tab => (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        backgroundColor: "#fff"
      }}
    >
      {tab.floors.map((item,index)=>(<ListContent {...item} key={index}></ListContent>))}
    </div>
  );

  render() {
    const {lists} =this.props
    return (
      <Tabs
        tabs={lists}
        renderTabBar={props => <Tabs.DefaultTabBar {...props} page={11} />}
        tabBarPosition="left"
        tabDirection="vertical"
        tabBarBackgroundColor="#f8f8f8"
        tabBarActiveTextColor="#e22626"
        tabBarUnderlineStyle={{border:'none',left:'0',borderLeft:'0.02rem solid #e22626',}}
      >
        {this.renderContent}
      </Tabs>
    );
  }
}
