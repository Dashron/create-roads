---
to: src/config.ts
---
import * as fs from 'fs';
import * as path from 'path';

export default function (folderPath: string, environment: string) {
	const files = fs.readdirSync(folderPath);
	let environmentConfig = {};
	let defaultConfig = {};

	for (let i = 0; i < files.length; i++) {
		if (files[i] === `config.${  environment  }.js`) {
			environmentConfig = require(path.format({
				dir: folderPath,
				base: files[i]
			}));
			break;
		}
	}

	if (fs.existsSync(path.format({
		dir: folderPath,
		base: 'config.default.js'
	}))) {
		defaultConfig = require(path.format({
			dir: folderPath,
			base: 'config.default.js'
		}));
	}

	return merge(defaultConfig, environmentConfig);
}

function merge(base: any, overrides: {[key: string]: any}) {
	if (typeof base != 'object') {
		base = overrides;
	} else {
		for (const key in overrides) {
			if (typeof overrides[key] === 'object') {
				base[key] = merge(base[key], overrides[key]);
			} else {
				base[key] = overrides[key];
			}
		}
	}

	return base;
}