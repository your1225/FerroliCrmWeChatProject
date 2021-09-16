// pages/partOrder/partOrder.js
const app = getApp()

import { request } from "../../request/request.js";
import { addMonth, formatDateByH, formatDate } from "../../utils/util.js"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dtStart: "2018-01-01",
        dtEnd: "2021-01-01",
        dtSelected: "2021-09-15",
        itemCode: "",
        itemName: "",
        materiel: null
    },

    bindDateChange: function (e) {
        this.setData({
            dtSelected: e.detail.value
        })
    },

    bindItemCodeChange: function (e) {
        this.setData({
            itemCode: e.detail.value
        })
    },

    handleGetMaterialInfo() {
        if (this.data.itemCode.trim() != "") {
            this.getMaterialInfo()
        }
    },

    async getMaterialInfo() {
        const reData = await request({ url: "Materiel/GetModel/" + this.data.itemCode.trim() });
        
        console.log(reData);
        if (reData != null){
            this.data.materiel = reData
            this.data.itemName = reData.prdName
        } else {
            this.data.materiel = null
            this.data.itemName = ""
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var nowDate = new Date();
        var startDate = new Date(addMonth(-12));
        var endDate = new Date(addMonth(12));

        this.setData({
            dtSelected: formatDateByH(nowDate),
            dtStart: formatDateByH(startDate),
            dtEnd: formatDateByH(endDate)
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    }

})