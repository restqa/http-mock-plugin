const cucumber = require("@cucumber/cucumber");
const RestQAHTTPMock = require("../src/index");
const got = require("got");
const path = require("path");
const {deepStrictEqual} = require("assert");
const {fork} = require("child_process");

const config = {
  folder: path.resolve(__dirname, "./stubs"),
  debug: false,
  port: 8887,
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

RestQAHTTPMock.addBeforeAllHook(function () {
  const expectedObject = {
    mock: {
      http: {
        GITHUB_API: "http://localhost:8887/github"
      }
    }
  };
  deepStrictEqual(this.restqa, expectedObject);
})
  .addGivenStep("I start a server", function () {
    const {envs} = this["http-mock"];
    this.cp = fork(path.join(__dirname, "server.js"), {
      silent: !config.debug,
      env: {
        ...process.env,
        ...envs
      }
    });
    const expectedObject = {
      GITHUB_API: "http://localhost:8887/github"
    };
    deepStrictEqual(envs, expectedObject);
  })
  .addWhenStep("I GET {string}", async function (path) {
    const url = "http://localhost:3001" + path;
    const {body, statusCode} = await got.get(url, {
      responseType: "json",
      throwHttpErrors: false
    });
    this.body = body;
    this.statusCode = statusCode;
  })
  .addThenStep("the status code should be {int}", function (status) {
    deepStrictEqual(this.statusCode, status);
  })
  .addThenStep("the response body should be:", function (body) {
    deepStrictEqual(body, body);
  })
  .addAfterHook(function () {
    this.cp && this.cp.kill("SIGKILL");
  })
  ._commit(cucumber, config);

cucumber.setDefaultTimeout(10000);
cucumber.setWorldConstructor(World);
