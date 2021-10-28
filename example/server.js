const express = require("express");
const got = require("got");

express()
  .get("/info", async (req, res) => {
    let url = `${process.env.GITHUB_API}/status`;
    if (req.query.foo) {
      url += "?match=query";
    }
    const response = await got.get(url, {
      responseType: "json"
    });
    res.json(response.body);
  })
  .listen(3000, () => {
    console.log("server is running on port 3000"); // eslint-disable-line no-console
  });
