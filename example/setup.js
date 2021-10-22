const cucumber = require("@cucumber/cucumber");
const RestQAHTTPMock = require("../src/index");
const got = require("got");
const path = require("path");
const {deepStrictEqual} = require("assert");
const {fork} = require("child_process");

const config = {
  stubs: path.resolve(__dirname, "./stubs"),
  debug: false,
  port: 8888
};

class World {
  constructor({attach}) {
    this.attach = attach;
  }

  getConfig() {
    return config;
  }
}

RestQAHTTPMock.addBeforeHook(function () {
  this.cp = fork(path.join(__dirname, "server.js"), {
    silent: false,
    env: {
      ...process.env,
      ROARR_LOG: false,
      HTTP_PROXY: this.mock.httpProxy,
      HTTPS_PROXY: this.mock.httpProxy,
      GLOBAL_AGENT_HTTP_PROXY: this.mock.httpProxy,
      GLOBAL_AGENT_HTTPS_PROXY: this.mock.httpProxy
      // NODE_TLS_REJECT_UNAUTHORIZED: 0
    }
  });
})
  .addAfterHook(function () {
    this.cp.kill("SIGKILL");
  })
  .addGivenStep("one step definition", async function () {
    const url = "http://localhost:3000";
    const {body} = await got.get(url + "/info", {responseType: "json"});
    deepStrictEqual(body.message, "Hello World!");
  })
  ._commit(cucumber, config);

cucumber.setDefaultTimeout(10000);
cucumber.setWorldConstructor(World);
