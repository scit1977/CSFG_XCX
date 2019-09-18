// pages/detail_tip/index.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    title: null,
    content: null,
    fujian: null
  },
  loadnews: function () {
    //postReq(url, data, cb)
    var that = this;
    let url = 'Gettipdetail/';
    let data = {
      id: this.data.id,

    }

    http.postReq(url, data).then(function (res) {
      console.log(res.result)

      that.setData({
        title: res.result.title,
        content: res.result.content,
        input_date: res.result.input_date,
        fujian: res.result.fujian,


      });
      //console.log(that.data.shipin != null)


      var WxParse = require('../../wxParse/wxParse.js');
      WxParse.wxParse('content', 'html', that.data.content, that, 25);
    })


  },//end of loadnews
  toattachment: function () {
    //查看附件
    wx.downloadFile({

      url: this.data.fujian,

      success: function (res) {

        var filePath = res.tempFilePath

        wx.openDocument({

          filePath: filePath,

          success: function (res) {

            console.log('打开文档成功')

          }

        })

      }

    })



  },// end of toattachment
  toback: function () {
    //返回
    wx.navigateBack({
      delta: 1
    });

  },// end of toback
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;

    this.setData({
      id: id,


    });
    //加载详情
    this.loadnews();
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