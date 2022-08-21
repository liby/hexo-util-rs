import test from 'ava'

import { Color } from '../index'

test('name', (t) => {
  const red = new Color('red')
  const pink = new Color('pink')
  const mid1 = red.mix(pink, 1 / 3)
  const mid2 = red.mix(pink, 2 / 3)

  t.is(`${red}`, '#f00')
  t.is(`${pink}`, '#ffc0cb')
  t.is(`${mid1}`, '#ff4044')
  t.is(`${mid2}`, '#ff8087')
})

test('hex', (t) => {
  const red = new Color('#f00')
  const pink = new Color('#ffc0cb')
  const mid1 = red.mix(pink, 1 / 3)
  const mid2 = red.mix(pink, 2 / 3)

  t.is(`${red}`, '#f00')
  t.is(`${pink}`, '#ffc0cb')
  t.is(`${mid1}`, '#ff4044')
  t.is(`${mid2}`, '#ff8087')
})

test('RGBA', (t) => {
  const steelblueA = new Color('rgba(70, 130, 180, 0.3)')
  const steelblue = new Color('rgb(70, 130, 180)')
  const mid1 = steelblueA.mix(steelblue, 1 / 3)
  const mid2 = steelblueA.mix(steelblue, 2 / 3)

  t.is(`${steelblueA}`, 'rgba(70, 130, 180, 0.3)')
  t.is(`${steelblue}`, '#4682b4')
  t.is(`${mid1}`, 'rgba(70, 130, 180, 0.53)')
  t.is(`${mid2}`, 'rgba(70, 130, 180, 0.77)')
})

test('HSLA', (t) => {
  const steelblueA = new Color('hsla(207, 44%, 49%, 0.3)')
  const steelblue = new Color('hsl(207, 44%, 49%)')
  const mid1 = steelblueA.mix(steelblue, 1 / 3)
  const mid2 = steelblueA.mix(steelblue, 2 / 3)

  t.is(`${steelblueA}`, 'rgba(70, 130, 180, 0.3)')
  t.is(`${steelblue}`, '#4682b4')
  t.is(`${mid1}`, 'rgba(70, 130, 180, 0.53)')
  t.is(`${mid2}`, 'rgba(70, 130, 180, 0.77)')
})
