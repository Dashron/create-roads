---
to: src/logger.ts
---
export interface Logger {
    log: (data: any) => any;
    warn: (warning: any) => any;
    info: (details: any) => any;
    error: (err: any) => any;
}

const logs: {
    [key: string]: Logger
} = {};

/**
 * This is a super simple logger for the purposes of this example. Every function used in this example
 * 		is used by roads, and expected to exist in the logging
 * object that you provide to the projects
 */

export function createLogger(logName: string): Logger {
	if (logs[logName]) {
		return logs[logName];
	}

	return logs[logName] = {
		log: (text) => {
			if (typeof text === 'object') {
				text = JSON.stringify(text);
			}

			console.log(`LOG: ${  text}`);
		},
		info: (text) => {
			if (typeof text === 'object') {
				text = JSON.stringify(text);
			}

			console.log(`INFO: ${  text}`);
		},
		warn: (text) => {
			if (typeof text === 'object') {
				text = JSON.stringify(text);
			}

			console.log(`WARN: ${  text}`);
		},
		error: (error) => {
			console.log(`LOG ERROR: ${  error.stack}`);
		}
	};
}