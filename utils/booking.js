// Passes stay in local storage. Swap these three functions for a server
// when check-in needs one shared list.
const KEY = 'lumen-night-03'

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'LM-'
  for (let i = 0; i < 4; i += 1) {
    code += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return code
}

function getBooking() {
  try {
    const saved = wx.getStorageSync(KEY)
    if (!saved || !saved.code) return null
    return saved
  } catch (err) {
    return null
  }
}

function saveBooking(next) {
  const prev = getBooking()
  const now = Date.now()
  const booking = {
    code: prev && prev.code ? prev.code : makeCode(),
    name: next.name,
    phone: next.phone,
    levelId: next.levelId,
    levelLabel: next.levelLabel,
    sessionId: next.sessionId,
    sessionName: next.sessionName,
    sessionTime: next.sessionTime,
    rental: !!next.rental,
    shoeSize: next.shoeSize || '',
    createdAt: prev && prev.createdAt ? prev.createdAt : now,
    updatedAt: now
  }
  wx.setStorageSync(KEY, booking)
  return booking
}

function clearBooking() {
  try {
    wx.removeStorageSync(KEY)
  } catch (err) {
    wx.setStorageSync(KEY, '')
  }
}

module.exports = {
  getBooking: getBooking,
  saveBooking: saveBooking,
  clearBooking: clearBooking
}
