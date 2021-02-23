import React, { Component, Fragment } from "react";
import "./index.scss";
import { Link, withRouter } from "react-router-dom";
import { Stepper, Modal, Toast } from "antd-mobile";
import request from "../../actions/request";

const alert = Modal.alert;
class ShopCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editFlag: false, //是否管理
      allChoose: false, //是否全选
      shopcarList: [], //购物车列表
      chooseList: [], //选中列表
      unChooseList: [], //未选中列表
    };
  }

  componentDidMount() {
    if (window.cookie.get("token")) {
      //判断身份并获取购物车数据
      this.getShopCar();
    } else {
      Toast.fail("请先登录", 2, () => {
        this.props.history.push("/login");
      });
    }
  }

  //是否全选
  chooseAll = (val) => {
    let newShopList = this.state.shopcarList;
    newShopList.map((item) => {
      return (item.flag = val);
    });
    if (val) {
      this.setState({
        allChoose: val,
        shopcarList: JSON.parse(JSON.stringify(newShopList)),
        chooseList: JSON.parse(JSON.stringify(newShopList)),
        unChooseList: [],
      });
    } else {
      this.setState({
        allChoose: val,
        shopcarList: JSON.parse(JSON.stringify(newShopList)),
        chooseList: [],
        unChooseList: JSON.parse(JSON.stringify(newShopList)),
      });
    }
  };

  //计算总和
  computedInfo = (val) => {
    switch (val) {
      case "price":
        let price = 0;
        this.state.chooseList.map((item) => {
          return (price += item.jiage * item.num);
        });
        return price.toFixed(1);
      case "quan":
        let quan = 0;
        this.state.chooseList.map((item) => {
          return (quan += item.quan * item.num);
        });
        return quan;
      default:
        break;
    }
  };

  //删除商品
  delShopItem = () => {
    this.setState(
      {
        shopcarList: JSON.parse(JSON.stringify(this.state.unChooseList)),
      },
      function () {
        this.setState(
          {
            unChooseList: JSON.parse(JSON.stringify(this.state.shopcarList)),
            chooseList: [],
          },
          function () {
            this.saveShopCar();
          }
        );
      }
    );
  };

  //支付按钮事件
  pay = () => {
    if (this.state.chooseList.length) {
      Toast.fail("该功能还为开放", 2);
    } else {
      Toast.info("您还没有选择物品哦", 2);
    }
  };

  //进入商品详情
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

  //选择
  checkTrue = (item) => {
    const { shopcarList, unChooseList, chooseList } = this.state;
    let newdata = shopcarList,
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
              this.state.chooseList.length === this.state.shopcarList.length
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
      shopcarList: newdata,
      unChooseList: newUnChooseList,
    });
  };

  //取消选择
  checkFalse = (item) => {
    const { shopcarList, unChooseList, chooseList } = this.state;
    let newdata = shopcarList,
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
      shopcarList: newdata,
      chooseList: newChooseList,
    });
  };

  //确认删除
  delConfirm = () => {
    if (!this.state.chooseList.length) {
      Toast.info("您还没有选择物品哦", 2);
    } else {
      alert("您确定删除吗？", "", [
        { text: "我再想想", onPress: () => console.log("cancel") },
        { text: "删除", onPress: () => this.delShopItem() },
      ]);
    }
  };

  //获取购物车列表
  getShopCar = () => {
    request({
      method: "POST",
      url: "/api/shopCar",
      data: {
        type: "getShopCar",
        token: window.cookie.get("token"),
      },
    }).then((res) => {
      this.setState({
        shopcarList: JSON.parse(JSON.stringify(res.data.info)),
        unChooseList: JSON.parse(JSON.stringify(res.data.info)),
      });
    });
  };

  //保存购物车列表
  saveShopCar = () => {
    request({
      method: "POST",
      url: "/api/shopCar",
      data: {
        type: "saveShopCar",
        token: window.cookie.get("token"),
        shopCar: this.state.shopcarList,
      },
    });
  };

  render() {
    const { shopcarList, allChoose, editFlag, chooseList } = this.state;
    return (
      <Fragment>
        <div className="shopcar-tab">
          <span>购物车</span>
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
        <div className="container shopcar-page">
          {shopcarList.length === 0 ? (
            <div className="shopcar-empty">
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582549636674&di=cf4d3f986d977754efa0a88e3e43c307&imgtype=0&src=http%3A%2F%2Fm.hua.com%2Fimages%2Fgwc_k.png"
                alt=""
              />
              <Link to="/home">去逛逛</Link>
            </div>
          ) : (
            <div className="shopcar-has">
              {shopcarList.map((item) => {
                return (
                  <div
                    className={"shopcar-item goodid-" + item.id}
                    key={item.id}
                    onClick={(e) => {
                      this.goShopDetail(e, item);
                    }}
                  >
                    {item.flag ? (
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
                    )}
                    <img src={item.pic} alt="" />
                    <div className="item-detail">
                      <p>{item.title}</p>
                      <div className="detail-content">
                        <del>原价：￥{item.yuanjia}</del>
                        <i>{item.quan}元券</i>
                      </div>
                      <div className="detail-content">
                        <em>￥{item.jiage}</em>
                        <Stepper
                          showNumber
                          max={10}
                          min={1}
                          value={item.num}
                          step={1}
                          onChange={(val) => {
                            let newShopList = shopcarList;
                            newShopList.map((i) => {
                              if (i.id === item.id) {
                                i.num = val;
                              }
                              return null;
                            });
                            this.setState(
                              {
                                shopcarList: newShopList,
                              },
                              function () {
                                this.saveShopCar();
                              }
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
          {editFlag ? (
            <div className="edit">
              <span className="collect-btn">移入收藏夹</span>
              <span
                className="del-btn"
                onClick={() => {
                  this.delConfirm();
                }}
              >
                删除
              </span>
            </div>
          ) : (
            <div className="account">
              {chooseList.length === 0 ? (
                <div className="account-detail">
                  合计：
                  <span>
                    <i>￥</i> 0
                  </span>
                </div>
              ) : (
                <div className="account-detail-1">
                  <div className="account-detail-total">
                    合计：
                    <span>
                      <i>￥</i> {this.computedInfo("price")}
                    </span>
                  </div>
                  <div className="account-detail-discount">
                    已优惠 ￥ {this.computedInfo("quan")}
                  </div>
                </div>
              )}
              <div className="account-btn" onClick={this.pay}>
                结算 ({chooseList.length})
              </div>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}
export default withRouter(ShopCar);
