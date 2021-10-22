const express = require("express");
const got = require("got");

// Needs to be added in order to use the HTTP_PROXY
const {bootstrap} = require("global-agent");
bootstrap();

express()
  .get("/info", async (req, res) => {
    const response = await got.get("http://api.github.com/status", {
      responseType: "json"
    });
    res.json(response.body);
  })
  .listen(3000, () => {
    console.log("server is running on port 3000"); // eslint-disable-line no-console
    console.log("Using HTTP PROXY", process.env.HTTP_PROXY); // eslint-disable-line no-console
  });
