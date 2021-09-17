// app.js
App({
  // onLaunch() {
  // // 展示本地存储能力
  // const logs = wx.getStorageSync('logs') || []
  // logs.unshift(Date.now())
  // wx.setStorageSync('logs', logs)

  // // 登录
  // wx.login({
  //   success: res => {
  //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //   }
  // })
  // },
  globalData: {
    theme: 'light', // dark
    userInfo: null,
    customLogin: null,
    openid: ""
  },
  themeChanged(theme) {
    this.globalData.theme = theme;
    themeListeners.forEach((listener) => {
      listener(theme);
    });
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener);
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener);
    if (index > -1) {
      themeListeners.splice(index, 1);
    }
  }
})
