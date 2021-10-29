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
    beforeAll: async function (config) {
      console.log("> Spin up the http-mock-server 👻 <"); // eslint-disable-line no-console
      if (config.debug !== undefined) {
        options.quiet = !config.debug;
      }
      cp = childProcess.fork(path.join(__dirname, "stubs.js"), {
        silent: options.quiet
      });
      options.envs = config.envs;
      options.folder = config.folder;
      cp.send(options);
      cp.unref();
      cp.disconnect();
    },
    before: function () {
      const {envs} = this.getConfig("http-mock");
      this.mock = {
        envs: {}
      };
      for (const [key, value] of Object.entries(envs)) {
        this.mock.envs[key] = `http://localhost:${options.port}/${value}`;
      }
    },
    afterAll: async function () {
      cp.kill();
    }
  }
};
