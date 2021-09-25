// pages/partOrderSearch/partOrderSearch.js
const app = getApp()

import { request } from "../../request/request.js";
import { addMonth, formatDateByH, addDay, formatDateToSimple } from "../../utils/util.js"
import { showToast } from "../../utils/asyncWx.js"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        publishDate: "",
        dtStart: "2018-01-01",
        dtEnd: "2021-01-01",
        dtSelected: "2021-09-15",
        poList: [],
        selectedIndex: 0,
        // 复制对话框
        dataShowDialog: false,
        dataShowTitle: "",
        dataShowBarcode: "",
        dialogButtons: [
            {
                type: 'primary',
                className: '',
                text: '复制并关闭',
                value: 1
            }
        ],
        slideButtons: [
            {
                type: 'warn',
                text: '删除'
            }
        ],
        showTipsDialog: false,
        tipsText: "",
        tipsButtons: [
            {
                text: '明白了'
            }
        ]
    },

    closeShowDialog() {
        this.setData({
            dataShowDialog: false
        });
    },

    slideButtonTap(e) {
        var po = this.data.poList[e.currentTarget.dataset.index];

        if (po == null) {
            this.setData({
                tipsText: "系统错误，请刷新后重试！",
                showTipsDialog: true
            });
            return
        }

        if (po.poReceive > 0) {
            this.setData({
                tipsText: "已经收货的不允许删除！",
                showTipsDialog: true
            });
            return
        }

        this.deleteData(po.poId)
    },

    tapDialogButton(e) {
        this.setData({
            showTipsDialog: false
        });
    },

    closeAndCopy(e) {
        // console.log(e.detail)
        // console.log(e.detail.item.value)
        var po = this.data.poList[this.data.selectedIndex];

        var endStr = "00000" + po.poNum;

        wx.setClipboardData({
            data: "二维码: " + po.poBarcodeHead + "  数量: 00001 - " + endStr.substr(endStr.length - 5),
            success(res) {
            }
        });

        this.setData({
            dataShowDialog: false
        });
    },

    bindCopyTap(e) {
        // console.log(e);
        // console.log(e.currentTarget.dataset.qrcode);
        // console.log(this.data.poList[e.currentTarget.dataset.index].poBarcodeHead);

        this.setData({
            selectedIndex: e.currentTarget.dataset.index,
            savedTitle: e.currentTarget.dataset.qrcode,
            dataShowDialog: true
        });
    },

    bindDateChange(e) {
        this.setData({
            dtSelected: e.detail.value
        })

        this.getRecordList();
    },

    async deleteData(poId) {
        const poCusNo = app.globalData.customLogin.cusNo;
        const saveParams = { poCusNo, poId }
        const { fOK, fMsg } = await request({ url: "PartOrder/Delete", method: "POST", data: saveParams });

        if (fOK === "True") {
            this.getRecordList();
        } else {
            wx.showToast({
                title: fMsg,
                icon: 'none',
                duration: 2000
            })
        }
    },

    async getRecordList() {
        const poCusNo = app.globalData.customLogin.cusNo;
        const poDate = this.data.dtSelected;
        const saveParams = { poCusNo, poDate }
        const res = await request({ url: "PartOrder/GetModelListByDate", method: "POST", data: saveParams });

        if (res.length > 0) {
            res.forEach(v => {
                var dateTmp = new Date(v.poDate).getDate();
                v.dayData = formatDateToSimple(v.poDate);
                v.isTouchMove = false;
            })
        }

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
            dtEnd: formatDateByH(endDate),
            publishDate: app.globalData.publishDate
        })

        wx.setNavigationBarTitle({
            title: app.globalData.customLogin.cusName
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getRecordList();
    }

})