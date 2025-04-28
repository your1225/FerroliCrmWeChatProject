// pages/partOrderBoxCheck/partOrderBoxCheck.js
const app = getApp()

import {
    request
} from "../../request/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        publishDate: "",
        scanNum: 0,
        poInfo: null
    },

    async getQRCodeInfo(qrCode) {

        const reData = await request({
            url: "PartOrder/GetModelByBoxQrocde/" + qrCode.replace('.', 'dot').replace("+", "add")
        });

        // console.log(reData);
        if (reData != null) {
            this.setData({
                poInfo: reData
            })

            if (reData.poIsBatch == false) {
                const num = parseInt(qrCode.substr(qrCode.length - 5))

                this.setData({
                    scanNum: num
                })

                if (num > reData.poNum) {
                    wx.showToast({
                        icon: 'error',
                        title: '二维码的流水号超出总数量'
                    })
                }
            }
        } else {
            this.setData({
                poInfo: null
            })

            wx.showToast({
                icon: 'error',
                title: '无法识别的二维码'
            })
        }
    },

    handleScanData(e) {
        wx.scanCode({
            onlyFromCamera: false,
            scanType: ['qrCode'],
            success: res => {
                if (res.errMsg == 'scanCode:ok') {
                    const codeFull = res.result

                    if (codeFull.length > 50) {
                        wx.showToast({
                            icon: 'none',
                            title: '二维码太长了吧！'
                        })

                        return
                    }

                    this.getQRCodeInfo(codeFull)
                }
            },
            fail: res => {
                // 接口调用失败
                wx.showToast({
                    icon: 'none',
                    title: '接口调用失败！'
                })
            },
            complete: res => {
                // 接口调用结束
                // console.log(res)
            }
        });
    },

    copyData(e) {
        if (this.data.poInfo == null) {
            wx.showToast({
                icon: 'none',
                title: '先扫描才有数据复制吧'
            })
            return
        }

        var po = this.data.poInfo;

        wx.setClipboardData({
            // data: "二维码: " + this.data.poInfo.poBarcodeHead + "  数量: 00001 - " + endStr.substr(endStr.length - 5),
            data: "一物一码: " + po.poBarcodeFrom + "  - " + po.poBarcodeTo + " 数量：" + po.poNum,
            success(res) {}
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            publishDate: app.globalData.publishDate
        })

        wx.setNavigationBarTitle({
            title: app.globalData.customLogin.cusName
        })
    }
})