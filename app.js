//app.js
App({

  onLaunch: function () {
    // 展示本地存储能力   
    var that = this;
    //获取屏幕设备属性   
    wx.getSystemInfo({
      success: e => {
        
        that.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        that.globalData.Custom = custom;
        let CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        if (CustomBar < 0) {
          CustomBar = 80
        }
        that.globalData.CustomBar = CustomBar;
       

        //适配全面屏底部距离
        if (CustomBar > 75) {
          that.globalData.tabbar_bottom = "y"
        }

      },
      fail: e => {
        console.log('failed ')
        that.globalData.StatusBar = 22
        that.globalData.CustomBar = 66
        that.globalData = false
      }
    })
    // 登录
    
    wx.login({
      success: res => {
        //code 用于获取openID的条件之一
        var code = res.code;       
        wx.request({
          url: that.globalData.urlPath + 'wxgetopenid/',         
          method: "POST",
          data: {
            code: code,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {  //后端返回的数据
          //console.log(res.data)
            let uid = res.data.uid;  
            let sessionid = res.data.sessionid;  
            let role = res.data.role;          
            that.globalData.openid = uid
            that.globalData.sessionid = sessionid
            that.globalData.role = role
            console.log('init role='+role)
            wx.setStorageSync('openid', uid) 
            wx.setStorageSync('sessionid', sessionid)  
            wx.setStorageSync('role', role)  
           
                       
          },
          fail: res => {
            toast.show({ content: '微信登录失败' });
          }
        });
      }
    }) // end of login
   

    // 获取用户信息
    wx.getSetting({

      success: res => {
        //console.log('wx.getsetting')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId            
              // console.log(res.userInfo)

              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {

                that.userInfoReadyCallback(res)
              }
            },
            fail: function () {
              // fail
              console.log("获取失败！")
            },
            complete: function () {
              // complete
              // console.log("获取用户信息完成！")
            }
          })
        } else {
          //弹出授权框
          // console.log('要求授权')

          //wx.showLoading()

        }
      }
    })
  },
  globalData: {
    userInfo: null,
    urlPath: 'https://fg.heyishe.cn/wx/',
    openid: null,
    sessionid:null,
    role:null,
    Custom: null,
    StatusBar: '20',
    CustomBar: '65',
    tabbar_bottom: '',
    state: true,
  }

})