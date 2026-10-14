const { event, sharePayload } = require('../../utils/event')
const bookingStore = require('../../utils/booking')

Page({
  data: {
    pad: 64,
    event: event,
    booking: null
  },

  onLoad() {
    this.sync()
  },

  onShow() {
    this.sync()
  },

  sync() {
    const nav = getApp().globalData.nav
    this.setData({
      pad: nav.total,
      booking: bookingStore.getBooking()
    })
  },

  goSignup() {
    wx.navigateTo({ url: '/pages/signup/signup' })
  },

  goPass() {
    wx.navigateTo({ url: '/pages/pass/pass' })
  },

  chooseWave(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/signup/signup?wave=' + id })
  },

  onShareAppMessage() {
    return sharePayload()
  },

  onShareTimeline() {
    return { title: sharePayload().title }
  }
})
