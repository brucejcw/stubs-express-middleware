const isServer = (server) => Boolean(server && server.request && server.response)
// for server instance(e.g. `express()`), we need to add `basePath` before proxy path 
const getProxyPathPrefix = (server, basePath) => isServer(server) ? basePath : ''

module.exports = {
  isServer,
  getProxyPathPrefix
}
