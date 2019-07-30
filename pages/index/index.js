//index.js
//获取应用实例

let app = getApp()
const http = require('../../utils/http.js');
Page({
  data: {
   
    imgUrls: [],
   
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    bannerHeight: 421.5,// Math.ceil(290.0 / 750.0 * getApp().screenWidth),
    jianjie_txt: ''
  
  },
  //事件处理函数
 
  onLoad: function () {
    this.loadnews()
   
  },
  loadnews: function () {
    //postReq(url, data, cb)
    var that = this;
    let url = 'gettopnews/';
    let data = {
      type: 1,
      page: 1
    }

    http.postReq(url, data).then(function (res) {
      that.setData({
        imgUrls: res.imgs,       
        jianjie_txt: res.jianjie_txt
      });
      var WxParse = require('../../wxParse/wxParse.js');
      WxParse.wxParse('content', 'html', that.data.jianjie_txt, that, 25);
    })
    

  },//end of loadmyorders
  
})
