Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: false
    }
  },

  data: {
    status: 20,
    bar: 44,
    padRight: 96
  },

  lifetimes: {
    attached() {
      const app = getApp()
      const nav = app && app.globalData && app.globalData.nav
      if (!nav) return
      this.setData({
        status: nav.status,
        bar: nav.bar,
        padRight: nav.padRight
      })
    }
  },

  methods: {
    onBack() {
      wx.navigateBack({
        delta: 1,
        fail() {
          wx.reLaunch({ url: '/pages/home/home' })
        }
      })
    }
  }
})
