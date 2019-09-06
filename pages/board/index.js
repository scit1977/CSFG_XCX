// pages/board/index.js
//获取应用实例
const app = getApp()
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: null,
    role:null,
    sessionid:null,
    bordItems: [],
    tipItems:[],
    
  },
  fetchbordItems() {
    //获取发射台类型
    var that = this;
    let url = 'Getbordlist/';
    let data = {
      uid: this.data.uid
    }
    http.header.Authorization = this.data.sessionid ;//给header 赋值
    http.postReq(url, data).then(function (res) {
      console.log('re seesion id=' + res.session_id)
      that.setData({
        bordItems: res.rows_bord,
        tipItems: res.rows_tip,
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
    //判断登录状态
   
    //判断登录状态结束
    this.data.uid = wx.getStorageSync('openid')
    this.data.sessionid = wx.getStorageSync('sessionid')
    this.data.role = wx.getStorageSync('role')
    let sessionid = this.data.sessionid
    let role = this.data.role
    //判断权限
    if (role==0){
      //跳转到个人中心
      wx.showModal({
        title: '提示',
        content: '权限不足，请先注册您的个人信息',
        text: 'center',
        complete() {
          wx.switchTab({
            url: '/pages/mine/index'
          })
        }
      })
      return false;
    }
    console.log('onshow sessionid=' + sessionid)
    console.log('onshow role=' + role)
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