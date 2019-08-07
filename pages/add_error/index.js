// pages/baoliao/new/index.js
import { promisify } from '../../utils/promise.util'
const wxUploadFile = promisify(wx.uploadFile)
const http = require('../../utils/http.js')
let util = require('../../utils/util.js')
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
    videoList:null,
    size:null,
    uid: '',
    tname:'',
    hasrole:0  //是否有权限
  },
  PickerChange(e) {
    //发射台选择处理
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
  ChooseVideo: function (){
    //视频选择
    console.log('videoList choose')
    
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {      
        
          let videoList=res.tempFilePath        
          that.setData({
            videoList: res.tempFilePath,
            size: (res.size / (1024 * 1024)).toFixed(2)
          })
         
       
      }
    })
    console.log(this.data.videoList)
  }, //end of ChooseVideo
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
  },// end of ChooseImage

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelVideo(e) {
    wx.showModal({
      title: '湖南电台',
      content: '确定要删除此视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          //this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            videoList:null,
            size:null
          })
        }
      }
    })
  },// end of DelVideo
  DelImg(e) {
    wx.showModal({
      title: '湖南电台',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },// end of DelImg
  
  dosubmit(){
    //提交数据
    let title = this.data.title
    let content = this.data.content
    let dtype = this.data.dtype
    let uid = this.data.uid
    let video = this.data.videoList
    let size = this.data.size
    wx.showLoading({
      title: '正在创建...',
      mask: true
    })
    let arr = []
    if (video) {


      arr.push(wxUploadFile({
        //url: 'http://172.18.42.183:8080/pyapp/Info/upload',
        url: 'https://fg.heyishe.cn/wx/Info/uploadv',
        filePath: video,
        name: 'uploadv',
      }))
    }
    // const arr = []
    // 将选择的图片组成一个Promise数组，准备进行并行上传
    for (let path of this.data.imgList) {
      arr.push(wxUploadFile({
        //url: 'http://172.18.42.183:8080/pyapp/Info/upload',
        url: 'https://fg.heyishe.cn/wx/Info/upload',
        filePath: path,
        name: 'uploadimg',
      }))
    }
    // console.log('uvideo='+arr)

    Promise.all(arr).then(res => {
      // 上传成功，获取这些图片在服务器上的地址，组成一个数组

      let imgs = res.map(item => JSON.parse(item.data).url)
      // let uvideo = res.map(item => JSON.parse(item.data).url)

      let uvideo = null
      if (imgs && size) {
        uvideo = imgs[0]
        imgs.splice(0, 1)
      }

      var that = this;
      let url = 'Info/Addnews/';
      let data = {
        title: title,
        content: content,
        dtype: dtype,
        imgs: imgs,
        uid: uid,
        uvideo: uvideo,
        fst_id: this.data.dtype
      }
      http.postReq(url, data).then(function (res) {
        console.log(res)

      })
      wx.switchTab({
        url: '../../pages/all_error/index'
      })
    }).catch(err => {
      console.log(">>>> upload images error:", err)

      wx.showModal({
        title: '错误',
        content: '上传 错误，请重试！',
        showCancel: false
      });

    }).then(() => {
      console.log('then...')
      wx.hideLoading()
    })

  },// end of dosubmit
  submitForm(e) {

    console.log('submit form')
    console.log(this.data.hasrole)
    console.log(this.data.hasrole == "0")

    let title = this.data.title
    let content = this.data.content   
    let size=this.data.size
    if (this.data.hasrole == "0") {
      wx.showModal({
        title: '提示',
        content: '权限不足，请先完善您的个人信息',
        text: 'center',
        complete() {
          wx.switchTab({
            url: '/pages/mine/index'
          })
        }
      })
      return false;
    }
    console.log(this.data.size)
    if (this.data.size > 10) {
      wx.showModal({
        title: '传输覆盖',
        content: '很抱歉，视频最大允许10M，当前为' + (this.data.size + 'M')
      })
      return false;
    } 
   
    if (title && content) {
      this.dosubmit()
     
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
    //获取发射机类型及用户信息
    var that = this;
    let url = 'Getfstlist/';
    let data = {
      uid: this.data.uid
    }
    http.postReq(url, data).then(function (res) {
      console.log(res.result)
      console.log(res.result[0])
     //console.log(res.result[1])
      that.setData({
        picker: res.result,
        dtype: res.result[0].id,
        tname: res.info[0].name,
        hasrole: res.info[0].role
      });
      console.log('role='+that.data.hasrole)
     
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

    this.fetchtype()
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