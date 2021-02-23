import React, { Component } from "react";
import "./index.scss";
import { Link, withRouter } from "react-router-dom";
import { Toast, Modal } from "antd-mobile";
import request from "../../actions/request";

const alert = Modal.alert;
class Favourite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editFlag: false,
      allChoose: false,
      favouriteList: [],
      chooseList: [],
      unChooseList: [],
    };
  }

  componentDidMount() {
    if (window.cookie.get("token")) {
      this.getLove();
    } else {
      Toast.fail("请先登录", 2, () => {
        this.props.history.push("/login");
      });
    }
  }

  //点击进入商品详情
  goShopDetail = (e, item) => {
    let arr = ["IMG", "P", "DEL", "EM"];
    let arr2 = ["detail-content", `shopcar-item goodid-${item.id}`];
    if (arr.includes(e.target.nodeName) || arr2.includes(e.target.className)) {
      this.props.history.push(
        `/shopDetail?id=${item.id}&goodsId=${item.goodsId}`,
        {
          id: item.id,
          title: item.title,
          yuanjia: item.yuanjia,
          jiage: item.jiage,
          miaoshu: item.miaoshu,
          pic: item.pic,
          xiaoliang: item.xiaoliang,
          quan: item.quan,
        }
      );
    }
  };

  //单个选择
  checkTrue = (item) => {
    const { favouriteList, unChooseList, chooseList } = this.state;
    let newdata = favouriteList,
      newUnChooseList = unChooseList,
      newChooseList = chooseList;
    newdata.map((i) => {
      if (i.id === item.id) {
        i.flag = !i.flag;
        this.setState(
          {
            chooseList: newChooseList.concat(item),
          },
          function () {
            if (
              this.state.chooseList.length === this.state.favouriteList.length
            ) {
              this.setState({
                allChoose: true,
              });
            }
          }
        );
      }
      return null;
    });
    newUnChooseList.map((i, index) => {
      if (i.id === item.id) {
        newUnChooseList.splice(index, 1);
      }
      return null;
    });
    this.setState({
      favouriteList: newdata,
      unChooseList: newUnChooseList,
    });
  };

  //单个取消选择
  checkFalse = (item) => {
    const { favouriteList, unChooseList, chooseList } = this.state;
    let newdata = favouriteList,
      newChooseList = chooseList,
      newUnChooseList = unChooseList;
    newdata.map((i) => {
      if (i.id === item.id) {
        i.flag = !i.flag;
        this.setState({
          unChooseList: newUnChooseList.concat(item),
          allChoose: false,
        });
      }
      return null;
    });
    newChooseList.map((i, index) => {
      if (i.id === item.id) {
        newChooseList.splice(index, 1);
      }
      return null;
    });
    this.setState({
      favouriteList: newdata,
      chooseList: newChooseList,
    });
  };

  //是否全选
  chooseAll = (val) => {
    let newShopList = this.state.favouriteList;
    newShopList.map((item) => {
      return (item.flag = val);
    });
    if (val) {
      this.setState({
        allChoose: val,
        favouriteList: JSON.parse(JSON.stringify(newShopList)),
        chooseList: JSON.parse(JSON.stringify(newShopList)),
        unChooseList: [],
      });
    } else {
      this.setState({
        allChoose: val,
        favouriteList: JSON.parse(JSON.stringify(newShopList)),
        chooseList: [],
        unChooseList: JSON.parse(JSON.stringify(newShopList)),
      });
    }
  };

  //确认删除
  delConfirm = () => {
    if (!this.state.chooseList.length) {
      Toast.info("您还没有选择物品哦", 2);
    } else {
      alert("您确定删除吗？", "", [
        { text: "我再想想", onPress: () => console.log("cancel") },
        { text: "删除", onPress: () => this.delFavouriteItem() },
      ]);
    }
  };

  //删除商品
  delFavouriteItem = () => {
    this.setState(
      {
        favouriteList: JSON.parse(JSON.stringify(this.state.unChooseList)),
      },
      function () {
        this.setState(
          {
            unChooseList: JSON.parse(JSON.stringify(this.state.favouriteList)),
            chooseList: [],
          },
          function () {
            this.saveLove();
          }
        );
      }
    );
  };

  //获取收藏列表
  getLove = () => {
    request({
      method: "POST",
      url: "/api/love",
      data: {
        type: "getLove",
        token: window.cookie.get("token"),
      },
    }).then((res) => {
      this.setState({
        favouriteList: JSON.parse(JSON.stringify(res.data.info)),
        unChooseList: JSON.parse(JSON.stringify(res.data.info)),
      });
    });
  };

  //保存收藏列表
  saveLove = () => {
    request({
      method: "POST",
      url: "/api/love",
      data: {
        type: "saveLove",
        token: window.cookie.get("token"),
        love: this.state.favouriteList,
      },
    });
  };

  render() {
    const { editFlag, allChoose, favouriteList } = this.state;
    return (
      <div className="favourite-page">
        <div className="shopcar-tab">
          <span>我的收藏</span>
          <i
            className="fa fa-angle-left"
            onClick={() => {
              this.props.history.goBack();
            }}
          ></i>
          {editFlag ? (
            <em
              onClick={() => {
                this.setState({ editFlag: !this.state.editFlag });
              }}
            >
              完成
            </em>
          ) : (
            <em
              onClick={() => {
                this.setState({ editFlag: !this.state.editFlag });
              }}
            >
              管理
            </em>
          )}
        </div>
        <div className="container">
          {favouriteList.length === 0 ? (
            <div className="fav-empty">
              <img
                src="https://wq.360buyimg.com/fd/h5/wxsq_dev/fav/images/empty_bag_090029f2.png"
                alt=""
              />
              <p>您的收藏夹是空的</p>
              <Link to="/home">去逛逛</Link>
            </div>
          ) : (
            <div className="shopcar-has">
              {favouriteList.map((item) => {
                return (
                  <div
                    className={"shopcar-item goodid-" + item.id}
                    key={item.id}
                    onClick={(e) => {
                      this.goShopDetail(e, item);
                    }}
                  >
                    {editFlag ? (
                      item.flag ? (
                        <i
                          className="fas fa-check-circle check"
                          onClick={() => {
                            this.checkFalse(item);
                          }}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-circle uncheck"
                          onClick={() => {
                            this.checkTrue(item);
                          }}
                        ></i>
                      )
                    ) : null}

                    <img src={item.pic} alt="" />
                    <div className="item-detail">
                      <p>{item.title}</p>
                      <div className="detail-content">
                        <del>原价：￥{item.yuanjia}</del>
                        <i>{item.quan}元券</i>
                      </div>
                      <div className="detail-content">
                        <em>￥{item.jiage}</em>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {editFlag ? (
          <div className="shopcar-tabbar">
            <div className="select">
              {allChoose ? (
                <i
                  className="fas fa-check-circle check"
                  onClick={() => {
                    this.chooseAll(false);
                  }}
                ></i>
              ) : (
                <i
                  className="fas fa-circle uncheck"
                  onClick={() => {
                    this.chooseAll(true);
                  }}
                ></i>
              )}
              <span>全选</span>
            </div>
            <div className="edit">
              <span
                className="del-btn"
                onClick={() => {
                  this.delConfirm();
                }}
              >
                删除
              </span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Favourite);
