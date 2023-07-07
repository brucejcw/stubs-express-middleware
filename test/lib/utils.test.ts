import { expect, test } from 'vitest'
import { getProxyPathPrefix, isServer } from '../../lib/utils'
import express from 'express'

test('test isServer()', () => {
  expect(isServer(express())).toBe(true)
  expect(isServer(express.Router())).toBe(false)
})

test('test getProxyPathPrefix()', () => {
  const basePath = '/customer/helpcenter'
  expect(getProxyPathPrefix(express(), basePath)).toBe(basePath)
  expect(getProxyPathPrefix(express.Router, basePath)).toBe('')
})

