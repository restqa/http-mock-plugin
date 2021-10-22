const fs = require("fs");
const YAML = require("YAML");
const glob = require("glob");

module.exports = function (options) {
  const fileList = glob.sync(`${options.stubs}/**/*.+(yaml|yml)`);
  const stubs = fileList.reduce((all, item) => {
    const content = YAML.parse(fs.readFileSync(item).toString("utf-8"));
    all[content.request.url] = content;
    return all;
  }, {});

  function getMatchingStub({url, requestOptions}) {
    const stub = stubs[url];
    if (!stub) return;
    if (requestOptions.method === stub.request.method.toUpperCase()) {
      return stub;
    }
  }

  return {
    summary: "Stub rule RestQA",
    *beforeSendRequest(req) {
      const stub = getMatchingStub(req);
      if (!stub) return;
      return {
        response: {
          statusCode: stub.response.status,
          header: stub.response.headers,
          body: stub.response.body
        }
      };
    }
  };
};
