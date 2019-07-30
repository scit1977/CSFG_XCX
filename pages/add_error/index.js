// pages/baoliao/new/index.js
import { promisify } from '../../utils/promise.util'
const wxUploadFile = promisify(wx.uploadFile)
const http = require('../../utils/http.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',//标题
    content: '',//内容
    titleCount: 0, //标题字数
    contentCount: 0, //正文字数

    date: null,
    textareaBValue: '',
    picker: [],
    index: 0,
    dtype: null,
    imgList: [],
    uid: ''
  },
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
  DateChange(e) {
    //日期选择处理
    this.setData({
      date: e.detail.value
    })
  },
  handleTitleInput(e) {
    //标题输入处理
    let value = e.detail.value
    console.log(value)
    this.setData({
      title: value
    })
    this.setData({
      titleCount: value.length //计算已输入的标题字数
    })
  },
  textareaBInput(e) {
    //内容输入处理
    const value = e.detail.value
    this.setData({
      content: value
    })
    this.setData({
      contentCount: value.length //计算已输入的内容字数
    })

  },
  ChooseImage() {
    //图像选择
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '湖南电台',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  submitForm(e) {
    console.log('submit form')
    let title = this.data.title
    let content = this.data.content
    let dtype = this.data.dtype
    let uid = this.data.uid

    if (title && content) {
      const arr = []
      // 将选择的图片组成一个Promise数组，准备进行并行上传
      for (let path of this.data.imgList) {
        arr.push(wxUploadFile({
          //url: 'http://172.18.42.183:8080/pyapp/Info/upload',
          url: 'https://fg.heyishe.cn/wx/Info/upload',
          filePath: path,
          name: 'uploadimg',
        }))
      }
      console.log('arr===')
      console.log(arr)
      Promise.all(arr).then(res => {
        // 上传成功，获取这些图片在服务器上的地址，组成一个数组
        //console.log(res)
        let imgs = res.map(item => JSON.parse(item.data).url)
        console.log(imgs)
        var that = this;
        let url = 'Info/Addnews/';
        let data = {
          title: title,
          content: content,
          dtype: dtype,
          imgs: imgs,
          uid: uid,
          fst_id: this.data.dtype
        }
        http.postReq(url, data).then(function (res) {
          console.log(res)

        })

      }).catch(err => {
        console.log(">>>> upload images error:", err)
      })
      /*
      

     
     
      wx.showLoading({
        title: '正在创建...',
        mask: true
      })
      // 开始并行上传图片
      /*
      Promise.all(arr).then(res => {
        // 上传成功，获取这些图片在服务器上的地址，组成一个数组
        console.log(res)
        let DD = res.map(item => JSON.parse(item.data).url)
        return DD
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      }).then(urls => {
        return createQuestion({
          title: title,
          content: content,
          images: urls
        })
      }).then(res => {
        const pages = getCurrentPages();
        const currPage = pages[pages.length - 1];
        const prevPage = pages[pages.length - 2];

       // prevPage.data.questions.unshift(res)
        //$digest(prevPage)

        //wx.navigateBack()
      }).catch(err => {
        console.log(">>>> create question error:", err)
      }).then(() => {
        wx.hideLoading()
      })
      /*
      console.log('t')
      const arr = []

      for (let path of this.data.imgList) {
        console.log(path)
        arr.push(
          wx.uploadFile({
            //wxUploadFile({
            url: 'http://172.18.42.183:8080/pyapp/Index/upload',
            filePath: path,
            name: 'uploadimg',
            success: function (res) {

              //打印
              console.log('ok')
              console.log(res.data)

            },
            fail: function (res) {
              console.log('fail')
            },
            complete: function (res) {
              console.log('cc')
            }

          })
        )
      }
      */
    } else {
      console.log('请输入所有项目')
      wx.showModal({
        title: '错误',
        content: '请输入所有必填项目',
        showCancel: false
      });
    }
  },
  initdate(){
    //日期初始化
    var DATE = util.formatDate(new Date());

    this.setData({

      date: DATE,

    });

  },// end of initdate
  fetchtype() {
    //获取发射机类型
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
      console.log(that.data.dtype)
     
    })
    // console.log(this.data.picker[0].id)
  },// end of  fetchtype
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uid = wx.getStorageSync('openid')
    
    this.fetchtype()
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
    this.initdate()
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