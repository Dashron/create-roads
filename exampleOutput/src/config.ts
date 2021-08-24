import * as fs from 'fs';
import * as path from 'path';

export default function (folderPath: string, prefix: string = 'config', environment: string = 'dev') {
	const files = fs.readdirSync(folderPath);
	let environmentConfig = {};

	for (let i = 0; i < files.length; i++) {
		if (files[i] === `${prefix}.${environment}.json`) {
			console.info(`loading config file ${folderPath}/${files[i]}`);
			environmentConfig = require(path.format({
				dir: folderPath,
				base: files[i]
			}));
			break;
		}
	}

	return environmentConfig;
}