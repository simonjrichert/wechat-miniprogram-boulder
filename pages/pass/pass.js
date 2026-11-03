const { event, sharePayload } = require('../../utils/event')
const bookingStore = require('../../utils/booking')

function maskPhone(phone) {
  const value = String(phone || '')
  if (value.length < 7) return value
  return value.slice(0, 3) + ' **** ' + value.slice(-4)
}

function doorHint(booking) {
  if (!booking) return ''
  if (booking.rental) return 'Come at 18:40 for shoe sizes.'
  return 'Doors at 18:40.'
}

Page({
  data: {
    pad: 64,
    event: event,
    booking: null,
    fresh: false,
    phoneOpen: false,
    masked: '',
    shoeLine: '',
    door: ''
  },

  onLoad(query) {
    this.fresh = !!(query && query.fresh === '1')
  },

  onShow() {
    const nav = getApp().globalData.nav
    const booking = bookingStore.getBooking()
    this.setData({
      pad: nav.total,
      booking: booking,
      fresh: this.fresh && !!booking,
      phoneOpen: false,
      masked: booking ? maskPhone(booking.phone) : '',
      shoeLine: !booking ? '' : (booking.rental ? 'Rental · EU ' + booking.shoeSize : 'Bringing climbing shoes'),
      door: doorHint(booking)
    })
  },

  togglePhone() {
    this.setData({ phoneOpen: !this.data.phoneOpen })
  },

  copyCode() {
    const booking = this.data.booking
    if (!booking) return
    wx.setClipboardData({ data: booking.code })
  },

  edit() {
    wx.navigateTo({ url: '/pages/signup/signup' })
  },

  goSignup() {
    wx.navigateTo({ url: '/pages/signup/signup' })
  },

  cancel() {
    wx.showModal({
      title: 'Give up this spot?',
      content: 'The pass code on this phone will be deleted.',
      confirmText: 'Drop',
      confirmColor: '#ff2bd6',
      cancelText: 'Keep',
      success: (res) => {
        if (!res.confirm) return
        bookingStore.clearBooking()
        wx.navigateBack({
          fail() {
            wx.reLaunch({ url: '/pages/home/home' })
          }
        })
      }
    })
  },

  onShareAppMessage() {
    return sharePayload()
  },

  onShareTimeline() {
    return { title: sharePayload().title }
  }
})
