// Sample night. Replace the date, price, and door before you publish.
;(function () {
const event = {
  series: 'LUMEN Night 03',
  titleTop: 'Blacklight',
  titleSub: 'bouldering',
  zh: '上海 · 黑光抱石',
  doorZh: '黑光抱石 · 11月7日 · 杨浦',
  dateLabel: 'Saturday 7 November 2026',
  day: '07',
  month: 'NOV',
  doors: '18:10',
  duration: '90 minutes',
  price: 0,
  priceNote: 'Sponsors pay for the night. One wave each.',
  city: 'Shanghai',
  area: 'Yangpu riverside',
  venue: 'LUMEN Room',
  gate: 'Gate 2, riverside warehouse',
  gateZh: '杨浦滨江仓库 2 号门',
  waves: [
    {
      id: 'one',
      name: 'Wave 1',
      time: '18:30–20:00',
      note: 'Starts with a walk along the easy traverse.',
      cap: '24 climbers'
    },
    {
      id: 'two',
      name: 'Wave 2',
      time: '20:30–22:00',
      note: 'Dark from the first hold. No intro.',
      cap: '24 climbers'
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
    { t: '18:10', d: 'Doors. Tea, liquid chalk, and shoe sizes at the desk.' },
    { t: '18:30', d: 'Wave 1. A short walk on the easy traverse, then the lights stay down.' },
    { t: '20:00', d: 'Wave 1 steps out so the room can go dark again.' },
    { t: '20:30', d: 'Wave 2 starts straight on the wall.' },
    { t: '22:00', d: 'Out. The warehouse lights come back on.' }
  ],
  includes: [
    '90 minutes on the UV wall',
    'Liquid chalk — loose chalk hangs in the beam',
    'Shoe rental, EU 35–47',
    'A canned tea at the desk'
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
    title: 'LUMEN Night 03 · Blacklight bouldering, 7 Nov in Yangpu',
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
