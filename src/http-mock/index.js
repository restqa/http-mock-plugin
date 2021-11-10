const path = require("path");
const childProcess = require("child_process");

const options = {
  port: 8899,
  quiet: false
};

let cp;

module.exports = {
  name: "http-mock",
  hooks: {
    beforeAll: function (config) {
      console.log("> Spin up the http-mock-server 👻 <"); // eslint-disable-line no-console
      try {
        const {envs} = config;

        if (config.debug !== undefined) {
          options.quiet = !config.debug;
        }
        cp = childProcess.fork(path.join(__dirname, "stubs.js"), {
          silent: options.quiet
        });
        options.port = config.port || options.port;
        options.envs = config.envs;
        options.folder = config.folder || path.resolve(process.cwd(), 'tests', 'stubs');
        cp.send(options);
        cp.unref();
        cp.disconnect();

        this.restqa = this.restqa || {};
        this.restqa.mock = this.restqa.mock || {};
        this.restqa.mock.http = getMock(envs);
      } catch (e) {
        cp && cp.kill();
      }
    },
    before: function () {
      const {envs} = this.getConfig("http-mock");
      this["http-mock"] = {
        envs: getMock(envs)
      };
    },
    afterAll: async function () {
      cp && cp.kill();
    }
  }
};

function getMock(envs) {
  const result = {};
  for (const [key, value] of Object.entries(envs)) {
    result[key] = `http://localhost:${options.port}/${value}`;
  }
  return result;
}

process.on("exit", () => {
  if (cp && !cp.killed) {
    cp.kill();
  }
});
