// pages/partOrder/partOrder.js
const app = getApp()

import { request } from "../../request/request.js";
import { addMonth, formatDateByH, formatDate } from "../../utils/util.js"
import { showToast } from "../../utils/asyncWx.js"

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
        materiel: null,
        poNum: 0,
        poRemark: "",
        savedSuccess: false,
        savedDialog: false,
        savedTitle: "",
        savedBarcode: "",
        dialogButtons: [
            {
                type: 'primary',
                className: '',
                text: '复制并关闭',
                value: 1
            }
        ]
    },

    bindDateChange(e) {
        this.setData({
            dtSelected: e.detail.value
        })
    },

    bindItemCodeChange(e) {
        this.setData({
            itemCode: e.detail.value
        })
    },

    bindPoNumChange(e) {
        this.setData({
            poNum: e.detail.value
        })
    },

    bindPoRemarkChange(e) {
        this.setData({
            poRemark: e.detail.value
        })
    },

    handleGetMaterialInfo() {
        if (this.data.itemCode.trim() != "") {
            this.getMaterialInfo()
        } else {
            wx.showToast({
                title: "请先输入物料编码",
                icon: 'none',
                duration: 2000
            })
        }
    },

    openSaveDialog() {
        this.setData({
            savedDialog: true
        });
    },

    closeSaveDialog() {
        this.setData({
            savedDialog: false
        });
    },

    closeAndCopy(e) {
        // console.log(e.detail)
        // console.log(e.detail.item.value)
        if (e.detail.item.value == 1) {
            var endStr = "00000" + this.data.poNum

            wx.setClipboardData({
                data: "二维码: " + this.data.savedBarcode + "  数量: 00001 - " + endStr.substr(endStr.length - 5),
                success(res) {
                }
            });

            this.setData({
                savedDialog: false,
                itemCode: "",
                itemName: "",
                poNum: 0,
                poRemark: ""
            });
        }
    },

    async getMaterialInfo() {
        const reData = await request({ url: "Materiel/GetModel/" + this.data.itemCode.trim() });
        // console.log(reData);
        if (reData != null) {
            this.setData({
                materiel: reData,
                itemName: reData.prdName
            })
        } else {
            this.setData({
                materiel: null,
                itemName: ""
            })
        }
    },

    async saveData() {
        if (this.data.itemName.trim() == "") {
            showToast({ title: "没有物料信息,请完善" });
            return
        }
        if (this.data.poRemark.trim() == "") {
            showToast({ title: "请填写备注信息,随便填填也好" });
            return
        }
        if (this.data.poNum <= 0) {
            showToast({ title: "麻烦把数量填一下" });
            return
        }

        const poCusNo = app.globalData.customLogin.cusNo
        const poPrdNoPart = this.data.itemCode
        const poNum = this.data.poNum
        const poEmpId = app.globalData.customLogin.empId
        const poSelData = this.data.dtSelected
        const poRemark = this.data.poRemark
        const saveParams = { poCusNo, poPrdNoPart, poNum, poEmpId, poSelData, poRemark }
        const { fOK, fMsg } = await request({ url: "PartOrder/Add", method: "POST", data: saveParams });

        if (fOK === "True") {
            this.setData({
                savedDialog: true,
                savedTitle: "保存成功!",
                savedSuccess: true,
                savedBarcode: fMsg
            })
        } else {
            this.setData({
                savedDialog: true,
                savedTitle: "保存失败，请重试...",
                savedSuccess: false,
                savedBarcode: ""
            })
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

        wx.setNavigationBarTitle({
            title: app.globalData.customLogin.cusName
        })
    }

    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function () {
    // console.log("customLogin:  " + app.globalData.customLogin.cusNo)
    // console.log("customLogin:  " + app.globalData.customLogin.empId)
    // }

})