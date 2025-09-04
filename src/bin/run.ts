#!/usr/bin/env node

import CreateRoads from '../commands/index.js'

await CreateRoads.run(process.argv.slice(2))