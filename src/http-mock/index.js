const AnyProxy = require("anyproxy");
const Rules = require("./rules");

let proxyServer;
const options = {
  port: 8899,
  webInterface: {
    enable: false
  },
  throttle: 10000,
  forceProxyHttps: false,
  wsIntercept: false,
  silent: true
};

module.exports = {
  name: "http-mock",
  hooks: {
    beforeAll: async function (config) {
      console.log("> Spin up the http-mock-server 🐳 <"); // eslint-disable-line no-console
      options.rule = Rules(config);
      options.port = config.port || options.port;
      if (undefined !== config.debug) {
        options.silent = !config.debug;
      }
      proxyServer = new AnyProxy.ProxyServer(options);
      proxyServer.start();
    },
    before: function () {
      this.mock = {
        httpProxy: `http://localhost:${options.port}`
      };
    },
    afterAll: async function () {
      proxyServer.close();
    }
  }
};
