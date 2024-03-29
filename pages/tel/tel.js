// pages/tel/tel.js
// pages/home/home.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    phonenum: '0731-85547260',
    couponDetail: {
      logoUrl: '../../images/logo.jpg',
      appName: '传输覆盖',
      title: '咨询热线',
      subTitle: '',
      useCondition: 'useCondition',
      useData: 'useData',
      useTime: '',
      excludeHoliday: '',
      excludeWeekend: '',
      address: 'address',
      phone: 'phone',
      background: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  makecall: function () {
    var that = this
    //显示“呼叫”、“添加联系人”弹窗
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        console.log("点击电话 res：", res)
        if (res.tapIndex == 0) {//直接呼叫
          wx.makePhoneCall({
            phoneNumber: that.data.phonenum,
            success: function (res_makephone) {
              console.log("呼叫电话返回：", res_makephone)
            }
          })
        } else if (res.tapIndex == 1) {//添加联系人
          wx.addPhoneContact({
            firstName: '传输覆盖',
            organization: '湖南电台技术管理部',
            mobilePhoneNumber: that.data.phonenum,
            success: function (res_addphone) {
              console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})