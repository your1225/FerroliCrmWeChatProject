// pages/scanState/scanState.js
const app = getApp()

import {
  request
} from "../../request/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productNameHeight: 0,
    timerId: 0,
    imageUrl: app.globalData.imageUrl,
    disList: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var winWid = wx.getWindowInfo().windowWidth;
    var ratio = 750 / winWid;
    var winHei = wx.getWindowInfo().windowHeight * ratio;

    let timerIdTmp = setInterval(() => this.getRecordList(), 10000)

    this.setData({
      timerId: timerIdTmp,
      productNameHeight: winHei - 400
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    let that = this
    clearInterval(that.data.timerId);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let that = this
    clearInterval(that.data.timerId);
  },

  async getRecordList() {
    const res = await request({
      url: "ProductScanCollect/GetDataNow",
      method: "GET"
    });

    // let dateFrom = "2025-11-15";
    // let dateTo = "2025-11-18";

    // const dateFromTo = {
    //   dateFrom,
    //   dateTo
    // }
    // const res = await request({
    //   url: "ProductScanCollect/GetDataByDate",
    //   method: "POST",
    //   data: dateFromTo
    // });

    // console.log(res)

    if (res.length == 0) {
      this.setData({
        disList: null
      })

      return;
    }

    let filterList = res.filter(item => {
      return item.dataType == 1
    })

    var newList = []

    filterList.forEach(item => {
      var productCode = item.dataCode
      var productName = item.dataName
      var productCount = item.dataCount

      let insInfo = res.find(ins => {
        return ins.dataCode == item.dataCode && ins.dataType == 2
      })
      var inspectionCheckCount = 0
      if (insInfo != undefined) {
        inspectionCheckCount = insInfo.dataCount;
      }

      let bomInfo = res.find((bom) => {
        return bom.dataCode == item.dataCode && bom.dataType == 4
      })
      var bomCount = 0
      if (bomInfo != undefined) {
        bomCount = bomInfo.dataCount;
      }

      let partMustCount = bomCount * item.dataCount

      let psInfo = res.find(ps => {
        return ps.dataCode == item.dataCode && ps.dataType == 3
      })
      var partScanCount = 0
      if (psInfo != undefined) {
        partScanCount = psInfo.dataCount;
      }

      let partScanPercent = partScanCount * 100 / partMustCount
      let productScanPercent = inspectionCheckCount * 100 / productCount

      newList.push({
        productCode: productCode,
        productName: productName,
        productCount: productCount,
        inspectionCheckCount: inspectionCheckCount,
        productScanPercent: productScanPercent,
        bomCount: bomCount,
        partMustCount: partMustCount,
        partScanCount: partScanCount,
        partScanPercent: partScanPercent
      })
    })

    // console.log(res)
    console.log(newList)

    this.setData({
      disList: newList
    })
  }

})