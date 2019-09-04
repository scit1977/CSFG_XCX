// pages/board/index.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: null,
    bordItems: [],
   

  },
  fetchbordItems() {
    //获取发射台类型
    var that = this;
    let url = 'Getbordlistmore/';
    let data = {
      uid: this.data.uid
    }
    http.postReq(url, data).then(function (res) {
      console.log(res.result)
      that.setData({
        bordItems: res.rows_bord,        
      });

      console.log(that.data.bordItems)
      // that.NewsItemsShow()
    })
    // console.log(this.data.picker[0].id)
  },// end of  fetchtype
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.data.uid = wx.getStorageSync('openid')
    this.fetchbordItems()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})