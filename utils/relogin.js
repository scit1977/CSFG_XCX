// 登录
let app = getApp()
function relogins(){


wx.login({
  success: res => {
    //code 用于获取openID的条件之一
    var code = res.code;
    wx.request({
      url: app.globalData.urlPath + 'wxgetopenid/',
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
        app.globalData.openid = uid
        app.globalData.sessionid = sessionid
        app.globalData.role = role
        wx.setStorageSync('openid', uid)
        wx.setStorageSync('sessionid', sessionid)
        wx.setStorageSync('role', role)
        console.log('relogin FUNCTION  seseion id' + sessionid)

      },
      fail: res => {
        toast.show({ content: '微信登录失败' });
      }
    });
  }
}) // end of login
}
module.exports = {
  relogins: relogins,
  
}