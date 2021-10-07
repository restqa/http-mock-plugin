const cucumber = require('@cucumber/cucumber')
const RestQAHTTPMock = require('../src/index')
const got = require('got')
const path = require('path')
const { deepStrictEqual } = require('assert')

const config = {
  stubs: path.resolve(__dirname, './stubs'),
  debug: false
}

class World {

  constructor({ attach }) {
    this.attach = attach
  }

  getConfig () {
    return config
  }
}

RestQAHTTPMock
  .addGivenStep('one step definition', async function () {
    const { url } = this.mock.http
    const { body } = await got.get(url + '/example', { responseType: 'json' })
    const expectedBody = {
      message: 'hello my friend'
    }
    deepStrictEqual(body, expectedBody)
  })
  ._commit(cucumber, config)

cucumber.setDefaultTimeout(10000)
cucumber.setWorldConstructor(World)
