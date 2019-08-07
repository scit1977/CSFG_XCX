// pages/all_error/index.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */

  data: {
    uid: null,
    NewsItems: [],
    picker: [],
    index: 0,
    dtype: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   


  },
  toadd: function () {
    //页面跳转
    wx.redirectTo({
      url: '../add_week/index',
    })

  },
  NewsItemsShow: function (success) {
    let fst_id = this.data.dtype
    console.log('fst_id=' + fst_id)
    var that = this;
    let url = 'Getweeklist/';
    let data = {
      fst_id: fst_id
    }

    http.postReq(url, data).then(function (res) {
      console.log(res.result)
      that.setData({
        NewsItems: res.result
      })
    })

  },// end of  classifyShow
  PickerChange(e) {
    //类型选择处理
    console.log(e);
    let index0 = e.detail.value
    this.setData({
      index: e.detail.value,
      dtype: this.data.picker[index0].id,
    })
    console.log(e.detail.value);
    this.NewsItemsShow();
  },//end of PickerChange
  fetchtype() {
    //获取发射台类型
    var that = this;
    let url = 'Getfstlist/';
    let data = {
      uid: this.data.uid
    }
    http.postReq(url, data).then(function (res) {
      console.log(res.result)
      that.setData({
        picker: res.result,
        dtype: res.result[0].id,
      });
      that.NewsItemsShow()
      console.log(that.data.dtype)
     // that.NewsItemsShow()
    })
    // console.log(this.data.picker[0].id)
  },// end of  fetchtype
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
    this.fetchtype()
   
    console.log(this.data.uid)
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