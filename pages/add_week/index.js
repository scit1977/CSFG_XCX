// pages/add_week/index.js
import { promisify } from '../../utils/promise.util'
const wxUploadFile = promisify(wx.uploadFile)
const http = require('../../utils/http.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: null,
    picker: [],//发射台数组
    index: 0, //选中的发射台数组序号
    dtype: null,
    uid: '',
    tname: '',
    hasrole: 0,  //是否有权限
    pdList:null,//发射机数组
    pdindex:0, //发射机编号  
    pdname:'', //发射机名称
    work_fre:'',
    in_power:'',
    back_power:'',
    zhubo:'',
    amb_v:'',
    amb_a:'',
    main_signal:true,
    back_signal:true,
    content:'',
    posttype:'添加',
    logid:'',
    totalnum:'',
    todonum:'',
    imgList: [],
    imgindex: 0,
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
  },// end of ChooseImage
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '传输覆盖系统',
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
  handle_work_fre(e) {
    //work_fre输入处理
    let value = e.detail.value
    console.log(value)
    this.setData({
      work_fre: value
    })
  },
  handle_in_power(e) {
    //in_power输入处理
    let value = e.detail.value
    console.log(value)
    this.setData({
      in_power: value
    })
  },
  handle_back_power(e) {
    //back_power输入处理
    let value = e.detail.value
    console.log(value)
    this.setData({
      back_power: value
    })
  },
  handle_zhubo(e) {
    //back_power输入处理
    let value = e.detail.value
    console.log(value)
    this.setData({
      zhubo: value
    })
  },
  handle_amb_v(e) {
    //amb_v输入处理
    let value = e.detail.value
    console.log(value)
    this.setData({
      amb_v: value
    })
  },
  handle_amb_a(e) {
    //amb_a输入处理
    let value = e.detail.value
    console.log(value)
    this.setData({
      amb_a: value
    })
  },
  listenerSwitchm: function (e) {
    console.log('ain_signal开关当前状态-----', e.detail.value);
    this.setData({
      main_signal: e.detail.value
    })

  },
  listenerSwitchb: function (e) {
    console.log(' back_signal开关当前状态-----', e.detail.value);
    this.setData({
      back_signal: e.detail.value
    })

  },
  textareaBInput(e) {
    //内容输入处理
    const value = e.detail.value
    this.setData({
      content: value
    })
    

  },
  dosubmit() {
    console.log('do submit')
    //提交数据
    let date=this.data.date
    let work_fre = this.data.work_fre
    let in_power = this.data.in_power
    let back_power = this.data.back_power
    let zhubo = this.data.zhubo
    let amb_v = this.data.amb_v
    let amb_a = this.data.amb_a
    let content = this.data.content
    let uid = this.data.uid
    let pdindex = this.data.pdindex
    let main_signal = this.data.main_signal
    let back_signal = this.data.back_signal
    let pdname=this.data.pdname
    let title=date//+" "+ pdname
    let posttype = this.data.posttype
    let logid=this.data.logid
    wx.showLoading({
      title: '正在创建...',
      mask: true
    })
    var that = this;
    let url = 'Info/Addweek/';
    if (posttype=='修改'){
      url = 'Info/Editweek/';
    }
    
    let arr = []
    //判断是否需要上传图片
    if (this.data.imgList[0].indexOf("heyishe") >= 0) {
     
     
        // 上传成功，获取这些图片在服务器上的地址，组成一个数组

      let imgs = this.data.imgList[0]
        // let uvideo = res.map(item => JSON.parse(item.data).url)

        let data = {
          title: title,
          work_fre: work_fre,
          in_power: in_power,
          back_power: back_power,
          zhubo: zhubo,
          amb_v: amb_v,
          amb_a: amb_a,
          content: content,
          pdindex: pdindex,
          main_signal: main_signal,
          back_signal: back_signal,
          uid: uid,
          posttype: posttype,
          logid: logid,
          imgs: imgs

        }

        http.postReq(url, data).then(function (res) {
          console.log(res)
          if (res == 'ok') {
            console.log('res ==ok  oko o')
            that.get_log_dat()
            wx.showToast({
              title: '提交成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          }

        })
      
        //console.log('then...')
        wx.hideLoading()
     

    }else{
      //
      for (let path of this.data.imgList) {
        arr.push(wxUploadFile({
          //url: 'http://172.18.42.183:8080/pyapp/Info/upload',
          url: 'https://fg.heyishe.cn/wx/Info/upload',
          filePath: path,
          name: 'uploadimg',
        }))
      }
      Promise.all(arr).then(res => {
        // 上传成功，获取这些图片在服务器上的地址，组成一个数组

        let imgs = res.map(item => JSON.parse(item.data).url)
        // let uvideo = res.map(item => JSON.parse(item.data).url)

        let data = {
          title: title,
          work_fre: work_fre,
          in_power: in_power,
          back_power: back_power,
          zhubo: zhubo,
          amb_v: amb_v,
          amb_a: amb_a,
          content: content,
          pdindex: pdindex,
          main_signal: main_signal,
          back_signal: back_signal,
          uid: uid,
          posttype: posttype,
          logid: logid,
          imgs: imgs

        }

        http.postReq(url, data).then(function (res) {
          console.log(res)
          if (res == 'ok') {
            console.log('res ==ok  oko o')
            that.get_log_dat()
            wx.showToast({
              title: '提交成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          }

        })
      }).catch(err => {
        console.log(">>>> upload images error:", err)

        wx.showModal({
          title: '错误',
          content: '上传 错误，请重试！',
          showCancel: false
        });

      }).then(() => {
        //console.log('then...')
        wx.hideLoading()
      })
    }
    //wx.switchTab({
    //  url: '../../pages/all_week/index'
    //})
  },  
  submitForm(e) {

    

    let work_fre = this.data.work_fre
    let in_power = this.data.in_power
    let back_power = this.data.back_power
    let zhubo = this.data.zhubo
    let amb_v = this.data.amb_v
    let amb_a = this.data.amb_a
    let imgs = this.data.imgList
   
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
   
    
   
    if (work_fre && in_power && back_power && zhubo && amb_v && amb_a  ) {
      if (imgs[0]!=undefined){
        this.dosubmit()
      }else{
        console.log('请输入*图片')

        wx.showModal({
          title: '错误',
          content: '请上传一张图片',
          showCancel: false
        });
      }
     

    } else {
      console.log('请输入*号项目')

      wx.showModal({
        title: '错误',
        content: '请输入所有红色必填项目',
        showCancel: false
      });
    }
  },
  Steps(e){
    //频道选择切换
    let id = e.currentTarget.dataset.id.id
    let pdname = e.currentTarget.dataset.id.fst_pd
  
   // console.log(dataset[0].id)
    this.setData({
      pdindex:id,
      pdname: pdname
    })
 
    this.get_log_dat() //调取当日 对应频道数据
   // console.log("pdselectid=", this.data.pdselectid);
  },

  get_log_dat(){
    //获取频道发射机对应日期数据
   
    var that = this;
    let url = 'Getfsjdata/';
    let data = {
      fsj_id: this.data.pdindex,
      title: this.data.date,
      fst_id: this.data.dtype
    }
    http.postReq(url, data).then(function (res) {
     
      that.setData({
        todonum: res.count
      })
     
      if (res.result.length==0){
       
        that.setData({
          work_fre: "",
          in_power: "",
          back_power: "",
          zhubo: "",
          amb_v: "",
          amb_a: "",
          content: "",
          imgList:[],
          main_signal: true,
          back_signal: true,
          posttype:'添加',
          logid:''
        });  
      }else
      {
       
       that.setData({
        work_fre: res.result[0].work_fre,
        in_power: res.result[0].in_power,
        back_power: res.result[0].back_power,
        zhubo: res.result[0].zhubo,
        amb_v: res.result[0].amb_v,
        amb_a: res.result[0].amb_a,
        content: res.result[0].content,
        logid: res.result[0].id,
       //  imgList: res.result[0].imgs,
        posttype:'修改'
       // main_signal: res.result[0].main_signal,
       // back_signal: res.result[0].back_signal,
       }); 
       //处理图像
        let img = res.result[0].imgs
        let imgs=[]
         if (img.length>2){
          imgs[0]=img
           that.setData({
             imgList:imgs
           });   
         }else{
           that.setData({
             imgList: []
           });
         }
        if (res.result[0].main_signal=='true'){
          that.setData({           
            main_signal: true,           
          }); 
        }else
        {
          that.setData({
            main_signal: false,
          }); 
        } 
        if (res.result[0].back_signal == 'true') {
          that.setData({
            back_signal: true,
          });
        } else {
          that.setData({
            back_signal: false,
          });
        } 
        
      }
     
    })  
   
  },
  PickerChange(e) {
    //发射台选择处理
    //console.log(e);
    let index0 = e.detail.value
    this.setData({
      index: e.detail.value,
      dtype: this.data.picker[index0].id,
    })
   
    this.fetchpdlist();
  },//end of PickerChange

  DateChange(e) {
    //日期选择处理
    this.setData({
      date: e.detail.value
    })
   
    this.get_log_dat() //调取当日 对应频道数据
  },// end of datechage

  initdate() {
    //日期初始化
    var DATE = util.formatDate(new Date());
    this.setData({
      date: DATE,
    });
  },// end of initdate
  fetchpdlist() {
    //获取频道信息
    var that = this;
    let url = 'Getpdlist/';
    let data = {
      fst_id: this.data.dtype
    }
    http.postReq(url, data).then(function (res) {
      //console.log(res.result)     
      that.setData({
        pdList: res.result,
        totalnum: res.result.length,
        pdindex: res.result[0].id,
        pdname: res.result[0].fst_pd       
      });
     
      that.get_log_dat() //调取当日 对应频道数据
      //console.log('pdList=' + that.data.pdList)
      //console.log('res.result[0].pdname=' + res.result[0])
      //console.log('pdname=' + that.data.pdname)

    })
    // console.log(this.data.picker[0].id)
  },// end of  fetchtype
  fetchtype() {
    //获取发射机类型及用户信息
   
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
        tname: res.info[0].name,
        hasrole: res.info[0].role
      });
     
      that.fetchpdlist()

    })
    // console.log(this.data.picker[0].id)
  },// end of  fetchtype
  pdSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uid = wx.getStorageSync('openid')
    this.fetchtype()
    this.initdate()
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