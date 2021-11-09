const fs = require("fs");
const YAML = require("yaml");
const glob = require("glob");
const {Stubby} = require("stubby");

process.on("message", function (options) {
  options.stubs = options.port;
  options.data = [];
  for (const [, folder] of Object.entries(options.envs)) {
    const files = glob.sync(`${options.folder}/${folder}/**/*.+(yaml|yml)`);
    files.reduce((stubs, file) => {
      const stub = getStub(folder, file);
      stubs.push(stub);
      return stubs;
    }, options.data);
  }
  const server = new Stubby();
  server.start(options);
});

function getStub(folder, file) {
  const content = fs.readFileSync(file).toString("utf-8");
  const stub = YAML.parse(content);
  stub.request.url = "/" + folder + stub.request.url;
  return stub;
}
