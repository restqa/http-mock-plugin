const RestQAPlugin = require("@restqa/plugin");
const RestQAHTTPMock = require("./http-mock");

/*
const options = {
  timeout: 1000
}
*/
const instance = new RestQAPlugin(RestQAHTTPMock.name);
instance
  .addBeforeAllHook(async function () {
    const config = instance._config;
    return RestQAHTTPMock.hooks.beforeAll(config);
  })
  .addBeforeHook(RestQAHTTPMock.hooks.before)
  .addAfterAllHook(RestQAHTTPMock.hooks.afterAll);

module.exports = instance;
