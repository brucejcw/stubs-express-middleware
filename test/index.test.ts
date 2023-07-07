import { describe, expect, test, vi } from 'vitest'
import express from 'express'
import middleware from '../index'

vi.mock('express', () => {
  const defaultExport = () => ({ use: vi.fn(), request: {}, response: {} })
  defaultExport.Router = () => ({ use: vi.fn() })

  return {
    default: defaultExport
  }
})

describe('test middleware()', () => {
  test('test typeof/params', () => {
    expect(middleware).toBeTypeOf('function')
    expect(middleware.length).toBe(2)
  })

  const config = {
    proxy: {
      '/bff': '/'
    },
    basePath: '/customer/helpcenter',
  }

  const proxyKey = Object.keys(config.proxy)[0]

  test('test express(), showPanel: false', () => {
    const server = express()

    middleware(server, config)

    expect(server.use).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(server.use.mock.calls[0][0]).toBe(config.basePath + proxyKey)
  })

  test('test express(), showPanel: true', () => {
    const server = express()

    middleware(server, { ...config, showPanel: true })
    expect(server.use).toHaveBeenCalledTimes(3)
    // @ts-ignore
    expect(server.use.mock.calls[0][0]).toBe(config.basePath + proxyKey)
    // @ts-ignore
    expect(server.use.mock.calls[1][0]).toBe(config.basePath + '/stubs')
  })

  test.only('test router, showPanel: false', () => {
    const router = express.Router()

    middleware(router, config)

    expect(router.use).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(router.use.mock.calls[0][0]).toBe(proxyKey)
  })

  test('test router, showPanel: true', () => {
    const router = express.Router()

    middleware(router, { ...config, showPanel: true })
    expect(router.use).toHaveBeenCalledTimes(3)
    // @ts-ignore
    expect(router.use.mock.calls[0][0]).toBe(proxyKey)
    // @ts-ignore
    expect(router.use.mock.calls[1][0]).toBe('/stubs')
  })
})
