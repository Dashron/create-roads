---
to: src/package.json
---
{
  "name": "",
  "version": "0.0.1",
  "author": {
    "name": "",
    "email": "",
    "url": ""
  },
  "description": "",
  "devDependencies": {},
  "dependencies": {
    "@types/browserify": "^12.0.36",
    "@types/watchify": "^3.11.0",
    "brfs": "2.0.2",
    "browserify": "^17.0.0",
    "roads": "7.0.0-alpha.3",
    "roads-server": "1.0.3",
    "watchify": "^4.0.0"
  },
  "private": true,
  "scripts": {
    "start": "tsc && node dist/node/server.js",
	"build": "tsc && node dist/node/buildClient.js"
  }
}