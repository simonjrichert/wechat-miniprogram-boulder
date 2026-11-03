// Sample night. Replace the date, price, and door before you publish.
;(function () {
const event = {
  series: 'Banana Bouldering',
  titleTop: 'Blacklight',
  titleSub: 'bouldering',
  zh: '上海 · 黑光抱石',
  doorZh: '香蕉抱石 · 12月11日',
  dateLabel: 'Friday',
  day: '11',
  month: 'DEC',
  doors: '18:40',
  duration: '90 min',
  price: 0,
  priceNote: 'Sponsors pay for the night.',
  city: 'Shanghai',
  area: '',
  venue: 'Banana Bouldering',
  gate: 'Shanghai',
  gateZh: '香蕉抱石',
  waves: [
    {
      id: 'night',
      name: 'One session',
      time: '19:00–21:00',
      note: 'Lights down the whole time.',
      cap: 'About 50 climbers'
    }
  ],
  levels: [
    {
      id: 'new',
      label: 'First time',
      hint: 'Jugs and a traverse. We will point at them.'
    },
    {
      id: 'easy',
      label: 'VB – V2',
      hint: 'You climb the easy wall at the gym.'
    },
    {
      id: 'mid',
      label: 'V3 – V5',
      hint: 'Regular sessions. You will have plenty.'
    },
    {
      id: 'hard',
      label: 'V6 and up',
      hint: 'A few UV problems are genuinely hard.'
    }
  ],
  timeline: [
    { t: '18:40', d: 'Doors. Liquid chalk and shoe sizes at the desk.' },
    { t: '19:00', d: 'On the wall. The lights stay down until 21:00.' },
    { t: '21:00', d: 'Out. The gym lights come back on.' }
  ],
  includes: [
    '90 minutes on the UV wall',
    'Liquid chalk — loose chalk hangs in the beam',
    'Shoe rental, EU 35–47'
  ],
  rules: [
    'No torches, phone lights, or camera flash on the wall.',
    'White cotton glows. Dark clothes disappear.',
    'Bouldering only. Keep your feet over the mat.',
    'One person on a problem at a time.',
    'You need to be 16 or older.'
  ],
  holds: [
    { id: 'lf', x: 72, y: 392, w: 30, h: 20, shape: 'foot', tone: 'cyan', turn: -14, mark: '' },
    { id: 'rf', x: 188, y: 398, w: 28, h: 18, shape: 'foot', tone: 'cyan', turn: 10, mark: '' },
    { id: 's1', x: 36, y: 308, w: 72, h: 52, shape: 'jug', tone: 'lime', turn: -8, mark: 'mark-start' },
    { id: 's2', x: 138, y: 328, w: 64, h: 46, shape: 'jug', tone: 'lime', turn: 6, mark: 'mark-start' },
    { id: 'p1', x: 230, y: 250, w: 34, h: 58, shape: 'pinch', tone: 'magenta', turn: 16, mark: '' },
    { id: 'c1', x: 292, y: 198, w: 58, h: 20, shape: 'crimp', tone: 'cyan', turn: -6, mark: '' },
    { id: 'sl', x: 364, y: 140, w: 62, h: 46, shape: 'sloper', tone: 'lime', turn: 4, mark: '' },
    { id: 'p2', x: 448, y: 96, w: 30, h: 48, shape: 'pinch', tone: 'magenta', turn: -14, mark: '' },
    { id: 'fin', x: 500, y: 40, w: 74, h: 56, shape: 'jug', tone: 'cyan', turn: 2, mark: 'mark-finish' }
  ]
}

const holdById = {}
for (let i = 0; i < event.holds.length; i += 1) {
  holdById[event.holds[i].id] = event.holds[i]
}
const handSequence = ['s1', 's2', 'p1', 'c1', 'sl', 'p2', 'fin']
event.tape = []
for (let i = 0; i < handSequence.length - 1; i += 1) {
  const from = holdById[handSequence[i]]
  const to = holdById[handSequence[i + 1]]
  const ax = from.x + from.w / 2
  const ay = from.y + from.h / 2
  const bx = to.x + to.w / 2
  const by = to.y + to.h / 2
  const dx = bx - ax
  const dy = by - ay
  event.tape.push({
    id: i + 1,
    x: Math.round(ax),
    y: Math.round(ay),
    w: Math.round(Math.sqrt(dx * dx + dy * dy)),
    rot: Math.round(Math.atan2(dy, dx) * 180 / Math.PI)
  })
}

const shoeSizes = []
for (let size = 35; size <= 47; size += 1) {
  shoeSizes.push(String(size))
}

function findWave(id) {
  const waves = event.waves
  for (let i = 0; i < waves.length; i += 1) {
    if (waves[i].id === id) return waves[i]
  }
  return waves[0]
}

function findLevel(id) {
  const levels = event.levels
  for (let i = 0; i < levels.length; i += 1) {
    if (levels[i].id === id) return levels[i]
  }
  return null
}

function sharePayload() {
  return {
    title: 'Banana Bouldering · Blacklight bouldering, 11 Dec',
    path: '/pages/home/home'
  }
}

const api = {
  event: event,
  shoeSizes: shoeSizes,
  findWave: findWave,
  findLevel: findLevel,
  sharePayload: sharePayload
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api
} else {
  window.LumenEvent = api
}
})()
