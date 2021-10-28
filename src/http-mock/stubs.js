const fs = require("fs");
const YAML = require("yaml");
const glob = require("glob");
const {Stubby} = require("stubby");

process.on("message", function (options) {
  options.stubs = options.port;
  options.data = [];
  for (const [, value] of Object.entries(options.envs)) {
    const files = glob.sync(`${options.folder}/${value}/**/*.+(yaml|yml)`);
    files.reduce((stubs, file) => {
      const content = fs.readFileSync(file).toString("utf-8");
      const stub = YAML.parse(content);
      stub.request.url = "/" + value + stub.request.url;
      stubs.push(stub);
      return stubs;
    }, options.data);
  }
  const server = new Stubby();
  server.start(options);
});
