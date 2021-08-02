---
to: package.json
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
  "devDependencies": {
    "@types/jsonwebtoken": "^8.5.4",
	"@types/browserify": "^12.0.36",
	"@types/cookie": "^0.4.1",
    "@types/watchify": "^3.11.0",
  },
  "dependencies": {
	"ajv": "8.6.2",
    "@types/browserify": "^12.0.36",
	"@types/cookie": "^0.4.1",
    "@types/watchify": "^3.11.0",
    "brfs": "2.0.2",
    "browserify": "^17.0.0",
	"cookie": "^0.4.1",
	"jsonwebtoken": "^8.5.1",
    "roads": "7.0.0-alpha.3",
    "roads-server": "1.0.3",
    "watchify": "^4.0.0",
	"sequelize": "^6.6.5"
  },
  "private": true,
  "scripts": {
    "start": "tsc && node dist/node/server.js",
	"build": "tsc && node dist/node/buildClient.js"
  }
}
