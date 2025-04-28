// pages/launchScreen/launchScreen.js
const app = getApp()

import { request } from "../../request/request.js";

Page({

    /**
   * 看能不能自动登录，如果不能，就到登录页面
   */
    async autoLogin(wxUserCode) {
        const reData = await request({ url: "UserAccount/WeChatAutoLogin/" + wxUserCode });
        console.log(wxUserCode);
        app.globalData.openid = reData.weChatOpenId;
        console.log(reData);

        if (reData.isPass == true) {
            app.globalData.customLogin = reData;

            wx.reLaunch({
                url: '/pages/partOrder/partOrder'
            })
            return;
        } else {
            wx.reLaunch({
                url: '/pages/login/login'
            })
            return;
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                this.autoLogin(res.code)
            }
        })
    }
})