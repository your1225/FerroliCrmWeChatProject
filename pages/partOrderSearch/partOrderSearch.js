// pages/partOrderSearch/partOrderSearch.js
const app = getApp()

import { request } from "../../request/request.js";
import { addMonth, formatDateByH, addDay } from "../../utils/util.js"
import { showToast } from "../../utils/asyncWx.js"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        dtStart: "2018-01-01",
        dtEnd: "2021-01-01",
        dtSelected: "2021-09-15",
        poList: []
    },

    async getRecordList() {
        const poCusNo = app.globalData.customLogin.cusNo;
        const poDate = this.data.dtSelected;
        const saveParams = { poCusNo, poDate }
        const res = await request({ url: "PartOrder/GetModelListByDate", method: "POST", data: saveParams });
        
        this.setData({
            poList: res
        })
      },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var nowDate = new Date(addDay(-7));
        var startDate = new Date(addMonth(-12));
        var endDate = new Date(addMonth(12));

        this.setData({
            dtSelected: formatDateByH(nowDate),
            dtStart: formatDateByH(startDate),
            dtEnd: formatDateByH(endDate)
        })
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