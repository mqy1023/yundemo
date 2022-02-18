// pages/detail/detail.js
const app = getApp();
let id, index;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    index = options.index
    this.getDetail();
  },

  //点击点赞按钮
  clickLike() {

    if (app.hasUserInfo()) {
      this.pushData();
    } else {
      wx.getUserProfile({
        desc: '授权需要',
        success: res => {
          wx.setStorageSync('userInfo', res.userInfo);
          app.globalData.userInfo = res.userInfo
        }
      })
    }
  },

  //把点赞发送到数据库
  pushData() {

    let onlike = this.data.detail.onlike;
    let zanSize = this.data.detail.zanSize;
    let userArr = this.data.detail.userArr;
    if (onlike) {
      zanSize--
      userArr.forEach((item, index) => {
        if (item.avatarUrl == app.globalData.userInfo.avatarUrl) {
          userArr.splice(index, 1)
        }
      })
    } else {
      zanSize++
      userArr.push({ avatarUrl: app.globalData.userInfo.avatarUrl })
      if (userArr.length >= 5) {
        userArr = userArr.slice(1, 6)
      }
    }
    this.setData({
      "detail.onlike": !onlike,
      "detail.zanSize": zanSize,
      "detail.userArr": userArr
    })

    let posttime = Date.now();
    wx.cloud.callFunction({
      name: "article_like_add",
      data: {
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        posttime,
        artid: id
      }
    }).then(res => {
      console.log(res);
    })
  },






  //获取详情页数据
  getDetail() {
    wx.cloud.callFunction({
      name: "article_list_get_one",
      data: {
        id
      }
    }).then(res => {

      res.result.data.content = res.result.data.content.replace(/<img/ig, "<img style='max-width:100%'")
      this.setData({
        detail: res.result.data,
        loading: false
      })
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 当前页面的上一个页面
    let pages = getCurrentPages()[getCurrentPages().length - 2];
    let listArr = pages.data.listArr; // 对应的listArr
    // index 索引值方便处理数据
    listArr[index].zanSize = this.data.detail.zanSize;
    // setData改变上个页面中的数据
    pages.setData({
      listArr
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})