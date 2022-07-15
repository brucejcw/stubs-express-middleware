const express = require('express')
const proxy = require('express-http-proxy')
const http = require('http')
const path = require('path')
const defaultConfig = {
    protocol: 'http',
    host: 'localhost',
    port: '5000',
    basePath: '',
    showPanel: false,
}
let config = {}

const getStubPath = (req, key) => {
    return path.resolve(`${config.proxy[key]}/${req.originalUrl.replace(config.basePath, '')}`)
}

const proxyMiddleware = key => {
    const origin = `${config.protocol}://${config.host}:${config.port}`
    return proxy(origin, {
        proxyReqPathResolver: req => {
            const stubPath = getStubPath(req, key)
            return path.resolve(`/api/${stubPath}`)
        },
        filter: req => {
            return new Promise(function (resolve, reject) {
                const stubPath = getStubPath(req, key)
                const testApi = `${origin}/api/${stubPath}`
                http.get(testApi, res => {
                    if (res.statusCode !== 200) {
                        res.resume()
                        reject()
                        return
                    }
                    res.on('data', () => {
                        /* keep the function */
                    })
                    res.on('end', () => {
                        console.log(`✅ Stub found => ${stubPath}`)
                        resolve(true)
                    })
                }).on('error', () => {
                    console.log(`❌️ Stub NOT found or disabled, call real api => ${stubPath}`)
                    reject()
                })
            })
        }
    })
}

const getPanel = () => {
    return `
      <script type="stubsConfig">${JSON.stringify(config)}</script>
      <script src="${config.basePath}/stubs/panel.js"></script>
    `
}

const stubsPanel = (req, res, next) => {
    if (req.headers && req.headers.accept && req.headers.accept.includes('text/html')) {
        const _end = res.end
        res.end = function (data) {
            if (data) {
                let body = data.toString()
                if (/<\/body>/.test(body)) {
                    try {
                        body = body.replace(/<\/body>/, s => getPanel() + s)
                        res.set({'Content-Length': Buffer.byteLength(body, 'utf-8')})
                        _end.call(res, body)
                        return
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            _end.apply(res, [...arguments])
        }
        const _write = res.write
        res.write = function (data) {
            let body = data.toString()
            if (/<\/body>/.test(body)) {
                try {
                    body = body.replace(/<\/body>/, s => getPanel() + s)
                    res.set({'Content-Length': Buffer.byteLength(body, 'utf-8')})
                    _write.call(res, body)
                    return
                } catch (e) {
                    console.error(e);
                }
            }
            _write.apply(res, [...arguments])
        }
        const _send = res.send
        res.send = function (string) {
            let body = Buffer.isBuffer(string) ? string.toString() : string
            body = body.replace(/<\/body>/, s => getPanel() + s)
            _send.call(this, body)
        }
    }
    next()
}

const setupPanel = app => {
    app.use('/stubs', express.static(__dirname))
    app.use(stubsPanel)
}

const stubsMiddleware = (app, _config) => {
    config = {...defaultConfig, ..._config}
    if (!config.proxy) {
        console.warn('No proxy set in stubs/config.json, skip running stubs.')
        return
    }
    Object.keys(config.proxy).map(key => {
        app.use(key, proxyMiddleware(key))
    })
    console.log('✅ stubs-middleware is running...')
    if (config.showPanel) {
        setupPanel(app)
    }
}

module.exports = stubsMiddleware
