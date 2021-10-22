# http-mock-plugin

👻 | Plugin extending the RestQA capability in order to mock all the external HTTP request made by your microservice

> Nothing is more annoying than mocking an external HTTP API on unit test!


## Description

### What is the problem this plugin solving?

Microservice architecture is amazing because it helps to keep the atomicity of a service. However most of the time microservice are not independent, they depend on thirds party APIs.
With this plugin we want to make mock of external HTTP services easy while testing microservice using RestQA.

## Installation

Within your microservice project tested by RestQA, run the following command:

```
npm i @restqa/http-mock-plugin
```

Then in your existing `.restqa.yml` under the local environment section, add the following:

```yaml
- name: "@restqa/http-mock-plugin"
  config:
    stub: ./tests/data/stubs
    debug: false
    port: 8888
```

Example of a complete `.restqa.yml`: 

```yaml
version: 0.0.1
metadata:
  code: JSON-PLACEHOLDER
  name: jsonplaceholder from typecode
  description: An example application to demo RestQA Features
environments:
  - name: local
    default: true
    plugins:
      - name: "@restqa/restqapi"
        config:
          url: http://localhost:8080
      - name: "@restqa/http-mock-plugin"
        config:
          stub: ./tests/data/stubs
          debug: false
          port: 8888
    outputs:
      - type: html
        enabled: true
```

## Options

| *Variable*   | *Description*                                                                         | *Default*             |
|:------------ |:--------------------------------------------------------------------------------------|:----------------------|
| `stubs`      | The folder where there stub files are located                                         | `./stubs`             |
| `debug   `   | Help you to debug the behavior of the plugin by printing information into the console | `false`               |
| `port`       | The port exposing the mock http proxy server                                          | `8899`                |     


## Usage

In order to mock an external call you will need create `.yml` files into the `stubs` folder.
The yaml file will need to respect the following format:

```yaml
request:
  url: http://api.github.com/status
  method: GET
response:
  status: 200
  headers:
     content-type: application/json
  body: >
    {
      "message": "Hello World!"
    }
```

Then every time your microservice will perform a request targeting `GET http://api.github.com/status` the response will be:

```

< HTTP/2 200
< content-type: application/json; charset=utf-8

{
  "message": "Hello World!"
}
```

## How does it work?

In order to intercept the request, the plugin is creating an HTTP Proxy and passing it as en environnement to your microservice.

### Warning

In order to intercept the external request made by your microservice, your codebase will need to be compatible with the HTTP_PROXY environment variable.
Luckely most of the programming language are handling it by default.
Now the story is different with NodeJs. It will depends a lot from the HTTP client library that you use.

##### NodeJS compatible library

| Library | Compatible | Comment |
| ----------| ---------- | ------- |
| [axios](https://www.npmjs.com/package/axios) | 👍  | |
| [got](https://www.npmjs.com/package/got) | 🚫  Need additional library | see https://github.com/sindresorhus/got/issues/560 |
| [superagent](https://www.npmjs.com/package/superagent) | 🚫  Need additional library | see https://github.com/visionmedia/superagent/issues/1 |
| [undici](https://www.npmjs.com/package/undici) | 🚫  Need additional library | No info |
| [node-fetch](https://www.npmjs.com/package/node-fetch) | 🚫  Need additional library | see https://github.com/node-fetch/node-fetch/issues/195 |


An other challenge come with mocking https request...  The technique is similar to man in the middle...

