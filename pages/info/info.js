// pages/info/info.js
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: null,
    sessionid:null,
    disabled:false,
    phoneNum: '',
    tname: '',
  },
  addnameInfo: function (e) {
    //姓名输入
    let tname = e.detail.value
    this.setData({
      tname: tname
    })
    console.log('tname =' + tname)
  },
  inputPhoneNum: function (e) {
    // 手机号码输入
    // console.log('inputPhoneNum 函数')
    let phoneNum = e.detail.value
    this.setData({
      phoneNum: phoneNum
    })
    console.log('phoneNum =' + phoneNum)
      //this.hideSendMsg()
    
  },
  checktname: function (tname) {
    if (tname.length>1){
      return true
    } else {
      wx.showModal({
        title: '错误',
        content: '请输入姓名!',
        showCancel: false
      });


      return false
    }
  },
  checkPhoneNum: function (phoneNum) {
    //检查手机格式是否正确
    let str = /^1[3-9][0-9]\d{8}$/  // if (!value.tel.match(/^1[3-9][0-9]\d{8}$/)) {
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showModal({
        title: '错误',
        content: '手机号格式不正确!',
        showCancel: false
      });


      return false
    }
  },
  dosubmit() {
    //提交数据
    let uid = this.data.uid//+" "+ pdname
    let phoneNum = this.data.phoneNum
    let tname = this.data.tname
    var that = this;
    let url = 'Editinfo/';
    let data = {
      uid: uid,
      phoneNum: phoneNum,
      tname: tname
    }
    http.header.Authorization = this.data.sessionid;//给header 赋值
    http.postReq(url, data).then(function (res) {
      console.log(res)
      console.log(res.message)
      if (res.message == 'ok') {
        //that.get_log_dat()
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }

    }) 
  }, 
  submitForm(e) {
    //提交表单
    console.log('submit form')
    let phoneNum = this.data.phoneNum
    let tname = this.data.tname

    
    let checkedNum = this.checkPhoneNum(phoneNum)
    let checktname=this.checktname(tname)
    //  console.log('checked='+checkedNum)
    if( (checkedNum)&& (checktname)) {
        
        //  console.log('phoneNum' + this.data.phoneNum)
        this.dosubmit()
        
      }
    

  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uid = wx.getStorageSync('openid')
    this.data.sessionid = wx.getStorageSync('sessionid')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})