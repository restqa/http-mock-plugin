const express = require("express");
const got = require("got");

express()
  .get("/info", async (req, res) => {
    let url = `${process.env.GITHUB_API}/status`;
    if (req.query.foo) {
      url += "?match=query";
    }
    const {body, statusCode} = await got.get(url, {
      responseType: "json"
    });
    res.status(statusCode).json(body);
  })
  .listen(3001, () => {
    console.log("server is running on port 3000"); // eslint-disable-line no-console
  });
