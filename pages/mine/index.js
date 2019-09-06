// pages/mine/mine.js
let app = getApp()
const http = require('../../utils/http.js');
Page({
  data: {
    uid: '',
    title: '',
    balance: '',
    userInfo: {},
    open:true,
    tname:null,
    hasUserInfo: false,//是否有用户信息，默认否
    btitle:'点击完善个人信息',
    haseditinfo:false
    
  },
  toinfo: function () {
    //页面跳转
    wx.navigateTo({
      url: '../info/info',
    })
  },
  onShow: function () {
    //console.log('p onShow')
    if (app.globalData.userInfo) {
      //1.1判断是否保存了全局用户信息，如果有就直接调取
      var uid = wx.getStorageSync('openid')
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        uid: uid
      })

      //读取后台数据，判断用户是否有地址信息

      this.get_data()
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      console.log('跳到授权页面')
     // wx.reLaunch({
       // url: '/pages/authorize/authorize',
     // })
    }
  },
   
  onLoad: function () {
    //console.log(' Personal.js app.globalData.userInfo=' + app.globalData.userInfo)
    // console.log('p onload')


  },
  getUserInfo: function (e) {
    
    let errMsg = e.detail.errMsg
    if (errMsg == "getUserInfo:fail auth deny"){
      //拒绝授权
     
    } else{
      //允许授权
      app.globalData.userInfo = e.detail.userInfo
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
   
  },
  get_data() {

    var that = this;
    let url = 'getbalance/';
    let data = {
      uid: this.data.uid,
    }
    http.postReq(url, data).then(function (res) {
      // http.postReq(url, data, function (res) {


      // console.log(data.result);
      if (res.result.name == '') {
        //没有名字信息，跳转到地址页面让用户填写信息
        that.setData({
          btitle: '点击完善个人信息',          
          haseditinfo: false
        })

      } else {
        /* wx.setStorage({
           key: 'address',
           data: res,         
         })*/
        that.setData({
          haseditinfo: true,
          btitle: '修改个人信息', 
          tname: res.result.name
        })
      }
    })


  },
  myAddress: function (e) {
    wx.navigateTo({ url: '../addressList/addressList' });
  }
})
