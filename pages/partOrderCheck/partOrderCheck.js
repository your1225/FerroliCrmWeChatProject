// pages/partOrderCheck/partOrderCheck.js
const app = getApp()

import { request } from "../../request/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        scanNum: 0,
        poInfo: null
        // poInfo: {
        //     poId: 1380,
        //     poCusNo: "gas",
        //     poCusName: "法罗力燃气生产线",
        //     poPrdNoPart: "90160050-01",
        //     poPrdNamePart: "塑料水路进水阀组件（单采暖）",
        //     poNum: 5,
        //     empId: 982,
        //     poDate: "2021-09-17 00:00:00",
        //     poBarcodeHead: "90160050-01gas210917001QKB",
        //     poRemark: "",
        //     poReceive: 5,
        //     poComplete: true,
        //     poCompleteDate: "2021-09-17 15:11:00",
        //     userName: "李泽建"
        // }
    },

    async getQRCodeInfo(qrCode) {
        const reData = await request({ url: "PartOrder/GetModelByBarcodeHead/" + qrCode.replace('.', 'dot') });
        // console.log(reData);
        if (reData != null) {
            this.setData({
                poInfo: reData
            })
        } else {
            this.setData({
                poInfo: null
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

                    const num = parseInt(codeFull.substr(codeFull.length - 5))
                    const codeHead = codeFull.substr(0, codeFull.length - 5)

                    // console.log(num)
                    // console.log(codeHead)

                    this.setData({
                        scanNum: num
                    })

                    this.getQRCodeInfo(codeHead)
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

        var endStr = "00000" + this.data.poInfo.poNum

        wx.setClipboardData({
            data: "二维码: " + this.data.poInfo.poBarcodeHead + "  数量: 00001 - " + endStr.substr(endStr.length - 5),
            success(res) {
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: app.globalData.customLogin.cusName
        })
    }
})