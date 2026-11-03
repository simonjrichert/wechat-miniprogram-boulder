const { event, shoeSizes, findWave, findLevel } = window.LumenEvent
const { normalizePhone, isMobile } = window.LumenForm

const KEY = 'lumen-night-03-preview'
const stack = ['home']
const state = {
  page: 'home',
  sessionId: 'one',
  levelId: '',
  name: '',
  phone: '',
  rental: false,
  sizeIndex: Math.max(0, shoeSizes.indexOf('41')),
  waiver: false,
  editing: false,
  error: '',
  fresh: false,
  phoneOpen: false
}

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!saved || !saved.code) return null
    return saved
  } catch (err) {
    return null
  }
}

function persist(next) {
  const prev = load()
  const now = Date.now()
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = prev && prev.code ? prev.code : 'LM-'
  if (!prev || !prev.code) {
    for (let i = 0; i < 4; i += 1) {
      code += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
  }
  const booking = {
    code: code,
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
  localStorage.setItem(KEY, JSON.stringify(booking))
  return booking
}

function maskPhone(phone) {
  const value = String(phone || '')
  if (value.length < 7) return value
  return value.slice(0, 3) + ' **** ' + value.slice(-4)
}

function doorHint(booking) {
  if (booking.rental) return 'Come at 19:00 for shoe sizes.'
  return 'Entry at 19:00.'
}

function captureFields() {
  const name = document.getElementById('name')
  const phone = document.getElementById('phone')
  const size = document.getElementById('size')
  if (name) state.name = name.value
  if (phone) state.phone = phone.value
  if (size) state.sizeIndex = Number(size.value)
}

function applyPageClass() {
  const device = document.getElementById('device')
  device.classList.remove('home', 'signup', 'pass')
  device.classList.add(state.page)
}

function render(resetScroll) {
  applyPageClass()
  const nav = document.getElementById('nav')
  nav.className = state.page === 'home' ? 'nav nav-home' : 'nav'
  nav.innerHTML = navHtml()
  document.getElementById('scroll').innerHTML = bodyHtml()
  const dock = document.getElementById('dock')
  if (state.page === 'home') {
    dock.hidden = false
    dock.className = 'dock'
    dock.innerHTML = dockHtml()
  } else {
    dock.hidden = true
    dock.className = 'dock'
    dock.innerHTML = ''
  }
  if (resetScroll) document.getElementById('scroll').scrollTop = 0
  placeFold()
}

function placeFold() {
  if (state.page !== 'home') return
  const scroll = document.getElementById('scroll')
  const fold = scroll.querySelector('.fold')
  const page = scroll.querySelector('.page')
  if (!fold || !page) return
  const padTop = parseFloat(getComputedStyle(page).paddingTop) || 0
  fold.style.minHeight = (scroll.clientHeight - padTop) + 'px'
}

function show(page, replace) {
  if (replace) {
    stack.pop()
    if (stack[stack.length - 1] !== page) stack.push(page)
  } else if (stack[stack.length - 1] !== page) {
    stack.push(page)
  }
  state.page = page
  render(true)
}

function back() {
  if (stack.length > 1) stack.pop()
  state.page = stack[stack.length - 1] || 'home'
  state.fresh = false
  render(true)
}

function navHtml() {
  if (state.page === 'home') {
    return '<div class="bar"></div>'
  }
  const title = state.page === 'signup' ? 'Reserve' : 'Your pass'
  return '<div class="bar"><div class="side"><button type="button" class="back" data-action="back"><i class="chevron"></i><span>Back</span></button></div><span class="nav-title">' + title + '</span></div>'
}

function dockHtml() {
  const booking = load()
  if (booking) {
    return '<div class="dock-copy"><span class="dock-code">' + esc(booking.code) + '</span><span class="dock-sub">' + esc(booking.sessionName) + ' · ' + esc(booking.sessionTime) + '</span></div><button type="button" class="btn" data-action="pass">View pass</button>'
  }
  return '<div class="dock-copy"><span class="dock-code">¥' + esc(event.price) + '</span><span class="dock-sub">' + esc(event.duration) + ' · ' + esc(event.venue) + '</span></div><button type="button" class="btn" data-action="signup">Reserve</button>'
}

function bodyHtml() {
  if (state.page === 'signup') return signupHtml()
  if (state.page === 'pass') return passHtml()
  return homeHtml()
}

function homeHtml() {
  const booking = load()
  const slots = event.timeline.map((item) => {
    return '<div class="slot"><span class="slot-t">' + esc(item.t) + '</span><span class="slot-d">' + esc(item.d) + '</span></div>'
  }).join('')
  const waves = event.waves.map((item) => {
    const mine = booking && booking.sessionId === item.id
    return '<div class="wave' + (mine ? ' mine' : '') + '" role="button" data-action="wave" data-id="' + esc(item.id) + '"><div class="wave-top"><span class="wave-name">' + esc(item.time) + '</span><span class="wave-go">' + (mine ? "You're in" : 'Reserve') + '</span></div><span class="wave-note">' + esc(item.note) + ' ' + esc(item.cap) + '.</span></div>'
  }).join('')
  const includes = event.includes.map((item) => {
    return '<div class="inc"><i class="pip"></i><span class="inc-t">' + esc(item) + '</span></div>'
  }).join('')
  const rules = event.rules.map((item) => {
    return '<div class="rule"><i class="dash"></i><span class="rule-t">' + esc(item) + '</span></div>'
  }).join('')

  return '<div class="page"><div class="fold"><div class="hero"><i class="orb orb-a"></i><i class="orb orb-b"></i><div class="date-badge"><span class="date-day">' + esc(event.day) + '</span><span class="date-mon">' + esc(event.month) + '</span></div><span class="title">' + esc(event.titleTop) + '</span><span class="title accent">' + esc(event.titleSub) + '</span><div class="meta-row"><span class="zh">' + esc(event.zh) + '</span><span class="when">' + esc(event.dateLabel) + ' · ' + esc(event.venue) + '</span></div><div class="facts"><div class="fact"><span class="fact-k">Doors</span><span class="fact-v">' + esc(event.doors) + '</span></div><div class="fact"><span class="fact-k">On the wall</span><span class="fact-v">' + esc(event.duration) + '</span></div><div class="fact"><span class="fact-k">Ticket</span><span class="fact-v">¥' + esc(event.price) + '</span></div></div></div><div class="wall"><img class="wall-art" src="../images/wall.svg?v=3" alt=""><span class="stamp">UV ONLY</span></div><span class="caption">Holds and tape fluoresce. The room stays dark.</span></div><div class="section"><span class="h">The night</span>' + slots + '</div><div class="section"><span class="h">The session</span><span class="intro">One sitting, about 50 climbers.</span>' + waves + '</div><div class="section"><span class="h">The ticket</span><div class="price-row"><span class="big">¥' + esc(event.price) + '</span><span class="per">' + esc(event.priceNote) + '</span></div>' + includes + '</div><div class="section"><span class="h">On the wall</span>' + rules + '</div><div class="section"><span class="h">The location</span><div class="place"><span class="place-name">' + esc(event.venue) + '</span><span class="place-line">' + esc(event.gateZh) + '</span><span class="place-dim">' + esc(event.city) + '</span><span class="place-note">Entry at 19:00. Shoe sizes are sorted at the desk.</span></div></div></div>'
}

function signupHtml() {
  const waves = event.waves.map((item) => {
    const on = state.sessionId === item.id ? ' on' : ''
    return '<div class="choice' + on + '" role="button" data-action="pick-wave" data-id="' + esc(item.id) + '"><span class="choice-name">' + esc(item.name) + ' · ' + esc(item.time) + '</span><span class="choice-meta">' + esc(item.note) + ' ' + esc(item.cap) + '.</span></div>'
  }).join('')
  const levels = event.levels.map((item) => {
    const on = state.levelId === item.id ? ' on' : ''
    return '<div class="choice' + on + '" role="button" data-action="pick-level" data-id="' + esc(item.id) + '"><span class="choice-name">' + esc(item.label) + '</span><span class="choice-meta">' + esc(item.hint) + '</span></div>'
  }).join('')
  const sizes = shoeSizes.map((size, index) => {
    const selected = index === state.sizeIndex ? ' selected' : ''
    return '<option value="' + index + '"' + selected + '>EU ' + esc(size) + '</option>'
  }).join('')
  const shoes = state.rental
    ? '<select id="size" class="field picker">' + sizes + '</select>'
    : ''
  const error = state.error ? '<span class="error">' + esc(state.error) + '</span>' : ''
  const keep = state.editing ? '<span class="keep">The door code stays the same.</span>' : ''

  return '<div class="page"><span class="kicker">' + esc(event.series) + '</span><span class="lead">' + (state.editing ? 'Edit your pass' : 'Reserve your spot') + '</span><span class="sub">' + esc(event.dateLabel) + ' · ' + esc(event.venue) + '</span>' + keep + '<div class="block"><span class="label">Session</span>' + waves + '</div><div class="block"><span class="label">Level</span>' + levels + '</div><div class="block"><span class="label">Name</span><input id="name" class="field" maxlength="24" placeholder="Name on the pass" value="' + esc(state.name) + '"></div><div class="block"><span class="label">Mobile</span><input id="phone" class="field" maxlength="20" inputmode="tel" placeholder="Mobile number" value="' + esc(state.phone) + '"></div><div class="block"><span class="label">Shoes</span><div class="choice' + (state.rental ? ' on' : '') + '" role="button" data-action="rental"><span class="choice-name">' + (state.rental ? 'Rent a pair' : 'I will bring mine') + '</span><span class="choice-meta">Rental is included. EU 35–47. Tap to switch.</span></div>' + shoes + '</div><div class="agree" role="button" data-action="waiver"><i class="tick' + (state.waiver ? ' on' : '') + '">' + (state.waiver ? '<i class="tick-mark"></i>' : '') + '</i><span class="agree-copy">I am 16 or older. I will not use a torch, phone light, or flash on the wall.</span></div>' + error + '<button type="button" class="btn submit" data-action="submit">' + (state.editing ? 'Update pass' : 'Reserve') + '</button><span class="fine">Your name, mobile, and pass stay on this phone. Nothing is sent to a server yet.</span></div>'
}

function passHtml() {
  const booking = load()
  if (!booking) {
    return '<div class="page"><span class="lead">No pass on this phone</span><span class="sub">Reserve a spot and the door code will show up here.</span><button type="button" class="btn empty-btn" data-action="signup">Reserve</button></div>'
  }
  const shoeLine = booking.rental ? 'Rental · EU ' + booking.shoeSize : 'Bringing climbing shoes'
  const saved = state.fresh ? '<span class="saved">Pass saved on this phone.</span>' : ''
  const phone = state.phoneOpen ? booking.phone : maskPhone(booking.phone)
  const hint = state.phoneOpen ? 'Tap to hide the number' : 'Tap the number to show it'
  return '<div class="page">' + saved + '<div class="pass"><div class="pass-bar"></div><div class="pass-body"><span class="series">' + esc(event.series) + '</span><span class="night">Blacklight</span><span class="zh">' + esc(event.doorZh) + '</span><div class="code-wrap" role="button" data-action="copy"><span class="code">' + esc(booking.code) + '</span><span class="code-hint">Tap the code to copy</span></div><div class="row"><span class="k">Name</span><span class="v">' + esc(booking.name) + '</span></div><div class="row"><span class="k">When</span><span class="v">' + esc(event.dateLabel) + '</span></div><div class="row"><span class="k">Time</span><span class="v">' + esc(booking.sessionTime) + '</span></div><div class="row"><span class="k">Level</span><span class="v">' + esc(booking.levelLabel) + '</span></div><div class="row"><span class="k">Shoes</span><span class="v">' + esc(shoeLine) + '</span></div><div class="row" role="button" data-action="phone"><span class="k">Mobile</span><span class="v">' + esc(phone) + '</span></div><span class="phone-hint">' + hint + '</span><div class="where"><span class="where-name">' + esc(event.venue) + '</span><span class="where-line">' + esc(event.gateZh) + '</span><span class="where-door">' + esc(doorHint(booking)) + '</span></div></div></div><span class="fine">Show this screen at the desk. It is stored on this phone only.</span><button type="button" class="ghost wide" data-action="edit">Change reservation</button><button type="button" class="text-btn" data-action="cancel">Give up this spot</button></div>'
}

function openSignup(waveId) {
  const existing = load()
  const requested = waveId || ''
  state.sessionId = findWave(requested || (existing && existing.sessionId) || 'one').id
  state.levelId = existing ? existing.levelId : ''
  state.name = existing ? existing.name : ''
  state.phone = existing ? existing.phone : ''
  state.rental = existing ? !!existing.rental : false
  state.sizeIndex = Math.max(0, shoeSizes.indexOf('41'))
  if (existing && existing.shoeSize) {
    const found = shoeSizes.indexOf(String(existing.shoeSize))
    if (found >= 0) state.sizeIndex = found
  }
  state.waiver = !!existing
  state.editing = !!existing
  state.error = ''
  show('signup')
}

function submit() {
  captureFields()
  const name = String(state.name || '').trim()
  const phone = normalizePhone(state.phone)
  if (!state.sessionId) {
    state.error = 'Pick a wave.'
    render(false)
    return
  }
  if (!state.levelId) {
    state.error = 'Pick your climbing level.'
    render(false)
    return
  }
  if (!name) {
    state.error = 'Add the name for the pass.'
    render(false)
    return
  }
  if (!isMobile(phone)) {
    state.error = 'Check the mobile number.'
    render(false)
    return
  }
  if (!state.waiver) {
    state.error = 'Confirm you are 16 or older, and that you will keep the wall dark.'
    render(false)
    return
  }
  const wave = findWave(state.sessionId)
  const level = findLevel(state.levelId)
  if (!level) {
    state.error = 'Pick your climbing level.'
    render(false)
    return
  }
  persist({
    name: name,
    phone: phone,
    levelId: level.id,
    levelLabel: level.label,
    sessionId: wave.id,
    sessionName: wave.name,
    sessionTime: wave.time,
    rental: state.rental,
    shoeSize: state.rental ? shoeSizes[state.sizeIndex] : ''
  })
  state.fresh = true
  state.phoneOpen = false
  show('pass', true)
}

function toast(message) {
  const el = document.getElementById('toast')
  el.textContent = message
  el.hidden = false
  clearTimeout(toast.timer)
  toast.timer = setTimeout(() => {
    el.hidden = true
  }, 1600)
}

function onClick(event) {
  const el = event.target.closest('[data-action]')
  if (!el || !document.getElementById('device').contains(el)) return
  const action = el.dataset.action
  if (action === 'back' || action === 'keep') {
    document.getElementById('modal').hidden = true
    if (action === 'back') back()
    return
  }
  if (action === 'signup') {
    openSignup('')
    return
  }
  if (action === 'wave') {
    openSignup(el.dataset.id)
    return
  }
  if (action === 'pass') {
    state.fresh = false
    state.phoneOpen = false
    show('pass')
    return
  }
  if (action === 'pick-wave' || action === 'pick-level' || action === 'rental' || action === 'waiver') {
    captureFields()
    state.error = ''
    if (action === 'pick-wave') state.sessionId = el.dataset.id
    if (action === 'pick-level') state.levelId = el.dataset.id
    if (action === 'rental') state.rental = !state.rental
    if (action === 'waiver') state.waiver = !state.waiver
    render(false)
    return
  }
  if (action === 'submit') {
    submit()
    return
  }
  if (action === 'edit') {
    openSignup('')
    return
  }
  if (action === 'cancel') {
    document.getElementById('modal').hidden = false
    return
  }
  if (action === 'drop') {
    localStorage.removeItem(KEY)
    document.getElementById('modal').hidden = true
    state.fresh = false
    back()
    return
  }
  if (action === 'phone') {
    state.phoneOpen = !state.phoneOpen
    render(false)
    return
  }
  if (action === 'copy') {
    const booking = load()
    if (!booking) return
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(booking.code).then(() => {
        toast('Copied')
      }).catch(() => {
        toast('Select the code to copy')
      })
    } else {
      toast('Select the code to copy')
    }
  }
}

document.getElementById('device').addEventListener('click', onClick)
document.getElementById('scroll').addEventListener('input', (event) => {
  if (event.target.id === 'name') state.name = event.target.value
  if (event.target.id === 'phone') state.phone = event.target.value
  if (!state.error) return
  state.error = ''
  const error = document.querySelector('.error')
  if (error) error.remove()
})
document.getElementById('scroll').addEventListener('change', (event) => {
  if (event.target.id === 'size') state.sizeIndex = Number(event.target.value)
})
document.getElementById('scroll').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && state.page === 'signup') {
    event.preventDefault()
    submit()
  }
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') document.getElementById('modal').hidden = true
})

render(true)
