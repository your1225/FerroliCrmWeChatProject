// pages/login/login.js
const app = getApp()

import { request } from "../../request/request.js";
import { showToast } from "../../utils/asyncWx.js"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        password: ""
    },

    usernameInput(e) {
        this.setData({
            username: e.detail.value
        })
    },

    passwordInput(e) {
        this.setData({
            password: e.detail.value
        })
    },

    async firstLogin(username, password) {
        if (username === "" || password === "") {
            await showToast({ title: "请先输入用户名及密码" });
            return;
        }

        const spUserName = this.data.username
        const spPassword = this.data.password
        const spOpenid = app.globalData.openid
        const saveParams = { spUserName, spPassword, spOpenid }
        const reData = await request({ url: "UserAccount/WeChatLoginCheck", method: "POST", data: saveParams });

        if (reData.isPass == true) {
            app.globalData.customLogin = reData;
            // console.log("customLogin:  " + app.globalData.customLogin)
            // console.log("customLogin.isPass:  " + app.globalData.customLogin.isPass)
            // console.log("customLogin.clId:  " + app.globalData.customLogin.clId)
            // console.log("customLogin.empId:  " + app.globalData.customLogin.empId)
            // console.log("customLogin.cusNo:  " + app.globalData.customLogin.cusNo)
            // console.log("customLogin.cusName:  " + app.globalData.customLogin.cusName)
            // console.log("customLogin.weChatOpenId:  " + app.globalData.customLogin.weChatOpenId)

            wx.reLaunch({
                url: '/pages/userInfo/userInfo'
            })
            return;
        } else {
            await showToast({ title: "请输入正确的用户名及密码" });
            return;
        }
    }
})