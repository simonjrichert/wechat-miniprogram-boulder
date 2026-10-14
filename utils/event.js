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
    { id: 1, x: 36, y: 292, size: 52, tone: 'lime', shape: 'jug' },
    { id: 2, x: 108, y: 236, size: 22, tone: 'cyan', shape: 'pinch' },
    { id: 3, x: 156, y: 168, size: 34, tone: 'magenta', shape: 'jug' },
    { id: 4, x: 214, y: 214, size: 16, tone: 'cyan', shape: 'pinch' },
    { id: 5, x: 248, y: 112, size: 40, tone: 'lime', shape: 'jug' },
    { id: 6, x: 328, y: 156, size: 20, tone: 'magenta', shape: 'pinch' },
    { id: 7, x: 368, y: 64, size: 30, tone: 'cyan', shape: 'jug' },
    { id: 8, x: 452, y: 108, size: 18, tone: 'lime', shape: 'pinch' },
    { id: 9, x: 508, y: 36, size: 44, tone: 'magenta', shape: 'jug' }
  ]
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
