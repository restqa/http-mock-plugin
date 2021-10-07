const {GenericContainer} = require("testcontainers");
const path = require("path");

let container;
const options = {
  port: 3000
};

module.exports = {
  name: "http-mock",
  hooks: {
    beforeAll: async function (config) {
      const buildContext = path.resolve(__dirname, "..", "..", "container");
      const build = await GenericContainer.fromDockerfile(buildContext).build(
        "restqa-mock-http"
      );

      container = await build
        .withExposedPorts(options.port)
        .withBindMount(config.stubs, "/stubs")
        .withEnv("DATA_FOLDER", "/stubs")
        .withEnv("PORT", options.port)
        .start();

      if (config.debug) {
        const stream = await container.logs();
        /* eslint-disable no-alert, no-console */
        stream
          .on("data", (line) => console.log(line))
          .on("err", (line) => console.error(line))
          .on("end", () => console.log("Stream closed"));
        /* eslint-enable no-alert, no-console */
      }
    },
    before: function () {
      const host = container.getHost();
      const port = container.getMappedPort(options.port);
      this.mock = this.mock || {};
      this.mock.http = {
        url: `http://${host}:${port}`
      };
    },
    afterAll: async function () {
      await container.stop();
    }
  }
};
