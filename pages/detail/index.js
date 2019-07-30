// pages/detail/index.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   id:null,
   title:null,
   content:null,
   imgs:null,
   shipin:null,
   input_date:null,
   name:null,
   fst_name:null
  },
  loadnews: function () {
    //postReq(url, data, cb)
    var that = this;
    let url = 'Getnewsdetail/';
    let data = {
      id: this.data.id,
     
    }

    http.postReq(url, data).then(function (res) {
      console.log(res.result)
      console.log(res.result.shipin)
      that.setData({
        title: res.result.title,
        content: res.result.content,
        name: res.result.name,
        fst_name: res.result.fst_name,
        input_date: res.result.input_date,
        shipin:res.result.shipin,
        imgs: res.imgs,

      });
      console.log(that.data.imgs)
      console.log(that.data.shipin)
      var WxParse = require('../../wxParse/wxParse.js');
      WxParse.wxParse('content', 'html', that.data.content, that, 25);
    })
   

  },//end of loadnews
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgs,
      current: e.currentTarget.dataset.url
    });
  },
  toback:function(){
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
    console.log('news id=' + options)
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