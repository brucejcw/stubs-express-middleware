import { expect, test } from 'vitest'
import middleware from '../index'

test('test middleware()', () => {
  expect(middleware).toBeTypeOf('function')
  expect(middleware.length).toBe(2)
})
