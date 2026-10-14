App({
  globalData: {
    nav: {
      status: 20,
      bar: 44,
      total: 64,
      padRight: 96
    }
  },

  onLaunch() {
    this.globalData.nav = readNav()
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
})

function readNav() {
  const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
  const status = win.statusBarHeight || 20
  let menu = null
  try {
    menu = wx.getMenuButtonBoundingClientRect()
  } catch (err) {
    menu = null
  }

  if (!menu || !menu.height) {
    return {
      status: status,
      bar: 44,
      total: status + 44,
      padRight: 96
    }
  }

  const bar = (menu.top - status) * 2 + menu.height
  return {
    status: status,
    bar: bar,
    total: status + bar,
    padRight: win.windowWidth - menu.left + 8
  }
}
