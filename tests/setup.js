const cucumber = require("@cucumber/cucumber");
const RestQAHTTPMock = require("../src/index");
const got = require("got");
const path = require("path");
const {deepStrictEqual} = require("assert");
const {fork} = require("child_process");

const config = {
  folder: path.resolve(__dirname, "./stubs"),
  debug: false,
  port: 8888,
  envs: {
    GITHUB_API: "github"
  }
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
  const {envs} = this.mock;
  this.cp = fork(path.join(__dirname, "server.js"), {
    silent: !config.debug,
    env: {
      ...process.env,
      ...envs
    }
  });
})
  .addAfterHook(function () {
    this.cp.kill("SIGKILL");
  })
  .addThenStep("Chech JSON response body", async function () {
    const url = "http://localhost:3000";
    const {body} = await got.get(url + "/info", {responseType: "json"});
    deepStrictEqual(body.message, "Hello World!");
  })
  .addThenStep("Chech JSON match query parameters", async function () {
    const url = "http://localhost:3000";
    const {body} = await got.get(url + "/info?foo=bar", {responseType: "json"});
    deepStrictEqual(body.message, "Hello World with query parameters!");
  })
  ._commit(cucumber, config);

cucumber.setDefaultTimeout(10000);
cucumber.setWorldConstructor(World);
