const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function convertRpx(css) {
  return css.replace(/(-?\d*\.?\d+)rpx/g, 'calc($1 * var(--rpx))')
}

function prefixSelector(selector, scope) {
  return selector.split(',').map((part) => {
    const s = part.trim()
    if (!s) return s
    if (s === 'page') return '.device'
    if (s.startsWith('page')) return '.device' + s.slice(4)
    return scope + ' ' + s
  }).join(', ')
}

function scopeCss(css, scope) {
  const clean = convertRpx(css.replace(/\/\*[\s\S]*?\*\//g, ''))
  let i = 0
  let out = ''
  while (i < clean.length) {
    const open = clean.indexOf('{', i)
    if (open === -1) {
      out += clean.slice(i)
      break
    }
    const selector = clean.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (j < clean.length && depth) {
      if (clean[j] === '{') depth += 1
      else if (clean[j] === '}') depth -= 1
      j += 1
    }
    const body = clean.slice(open, j)
    if (!selector) {
      out += body
    } else if (selector.startsWith('@')) {
      out += selector + ' ' + body
    } else {
      out += prefixSelector(selector, scope) + ' ' + body
    }
    i = j
  }
  return out
}

const parts = [
  scopeCss(fs.readFileSync(path.join(root, 'app.wxss'), 'utf8'), '.device'),
  scopeCss(fs.readFileSync(path.join(root, 'components/nav-bar/nav-bar.wxss'), 'utf8'), '.device'),
  scopeCss(fs.readFileSync(path.join(root, 'pages/home/home.wxss'), 'utf8'), '.home'),
  scopeCss(fs.readFileSync(path.join(root, 'pages/signup/signup.wxss'), 'utf8'), '.signup'),
  scopeCss(fs.readFileSync(path.join(root, 'pages/pass/pass.wxss'), 'utf8'), '.pass')
]

fs.writeFileSync(path.join(__dirname, 'preview.css'), parts.join('\n'), 'utf8')
console.log('wrote preview.css', parts.join('\n').length)
