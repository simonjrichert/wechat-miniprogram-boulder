;(function () {
function normalizePhone(raw) {
  return String(raw || '').replace(/[\s-]/g, '')
}

function isMobile(phone) {
  if (/^1[3-9]\d{9}$/.test(phone)) return true
  if (/^\+?[0-9]{8,15}$/.test(phone)) return true
  return false
}

const api = {
  normalizePhone: normalizePhone,
  isMobile: isMobile
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api
} else {
  window.LumenForm = api
}
})()
