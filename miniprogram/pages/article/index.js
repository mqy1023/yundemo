// miniprogram/pages/index/index.js
import common from "../../util/common";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },


  //获取列表数据
  getData(size = 0) {
    wx.cloud.callFunction({
      name: "article_list_get",
      data: {
        size
      }
    }).then(res => {
      console.log(res);

      res.result.data.forEach(item => {
        let hits = item.hits ? item.hits : 0
        item.hits = common.getNumber(hits);
        item._createTime = common.getTime(item._createTime, 5)
      })
      if (res.result.data <= 0) {
        this.setData({
          loading: false
        })
      }
      let oldData = this.data.listArr;
      let newData = oldData.concat(res.result.data)
      if (newData.length < 7) { // 对于云函数中每次取7条， 一页数据都不到
        this.setData({
          loading: false
        })
      }
      this.setData({
        listArr: newData
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
    this.getData(this.data.listArr.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})