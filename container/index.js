import path from 'path'
import fs from 'fs'
import YAML from 'yaml'
import glob from 'glob'
import { Stubby } from 'stubby'

const options = {
  absolute: true,
  cwd: path.join(process.env.DATA_FOLDER || process.cwd())
}

const files = glob.sync("**/*.{yaml,yml}", options)
const data = files.map((file) => {
  const content = fs.readFileSync(file).toString('utf-8')
  return YAML.parse(content)
})

const mockService = new Stubby();
const config = {
  quiet: false,
  stubs: process.env.PORT,
  data
}

mockService.start(config)
