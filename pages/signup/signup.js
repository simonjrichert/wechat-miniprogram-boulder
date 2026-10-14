const { event, shoeSizes, findWave, findLevel, sharePayload } = require('../../utils/event')
const bookingStore = require('../../utils/booking')
const { normalizePhone, isMobile } = require('../../utils/form')

Page({
  data: {
    pad: 64,
    event: event,
    shoeSizes: shoeSizes,
    sessionId: 'one',
    levelId: '',
    name: '',
    phone: '',
    rental: false,
    sizeIndex: shoeSizes.indexOf('41'),
    waiver: false,
    editing: false,
    error: ''
  },

  onLoad(query) {
    const nav = getApp().globalData.nav
    const existing = bookingStore.getBooking()
    const requested = query && query.wave ? query.wave : ''
    const sessionId = findWave(requested || (existing && existing.sessionId) || 'one').id
    let sizeIndex = shoeSizes.indexOf('41')
    if (existing && existing.shoeSize) {
      const found = shoeSizes.indexOf(String(existing.shoeSize))
      if (found >= 0) sizeIndex = found
    }

    this.setData({
      pad: nav.total,
      sessionId: sessionId,
      levelId: existing ? existing.levelId : '',
      name: existing ? existing.name : '',
      phone: existing ? existing.phone : '',
      rental: existing ? !!existing.rental : false,
      sizeIndex: sizeIndex,
      waiver: !!existing,
      editing: !!existing
    })
  },

  pickWave(e) {
    this.setData({ sessionId: e.currentTarget.dataset.id, error: '' })
  },

  pickLevel(e) {
    this.setData({ levelId: e.currentTarget.dataset.id, error: '' })
  },

  onName(e) {
    this.setData({ name: e.detail.value, error: '' })
  },

  onPhone(e) {
    this.setData({ phone: e.detail.value, error: '' })
  },

  toggleRental() {
    this.setData({ rental: !this.data.rental, error: '' })
  },

  onSize(e) {
    this.setData({ sizeIndex: Number(e.detail.value) })
  },

  toggleWaiver() {
    this.setData({ waiver: !this.data.waiver, error: '' })
  },

  submit() {
    if (this.saving) return
    const data = this.data
    const name = String(data.name || '').trim()
    const phone = normalizePhone(data.phone)

    if (!data.sessionId) {
      this.setData({ error: 'Pick a wave.' })
      return
    }
    if (!data.levelId) {
      this.setData({ error: 'Pick your climbing level.' })
      return
    }
    if (!name) {
      this.setData({ error: 'Add the name for the pass.' })
      return
    }
    if (!isMobile(phone)) {
      this.setData({ error: 'Check the mobile number.' })
      return
    }
    if (!data.waiver) {
      this.setData({ error: 'Confirm you are 16 or older, and that you will keep the wall dark.' })
      return
    }

    const wave = findWave(data.sessionId)
    const level = findLevel(data.levelId)
    if (!level) {
      this.setData({ error: 'Pick your climbing level.' })
      return
    }

    this.saving = true
    bookingStore.saveBooking({
      name: name,
      phone: phone,
      levelId: level.id,
      levelLabel: level.label,
      sessionId: wave.id,
      sessionName: wave.name,
      sessionTime: wave.time,
      rental: data.rental,
      shoeSize: data.rental ? data.shoeSizes[data.sizeIndex] : ''
    })

    wx.vibrateShort({ type: 'light' })
    wx.redirectTo({
      url: '/pages/pass/pass?fresh=1',
      fail: () => {
        this.saving = false
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
