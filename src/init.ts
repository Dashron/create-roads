import { command } from 'execa';
import * as path from 'path';
import { runner, Logger } from 'hygen';

function hygenInit() {
	// https://github.com/jondot/hygen/#build-your-own
	// TODO: HOW DO I TELL THE DIFFERENCE BETWEEN THE INIT PATH AND THIS FOLDERS PATH?
	// todo: test and test again
	return runner(['init', 'main'], {
		templates: path.join(__dirname, '../_templates'),
		cwd: process.cwd(),
		logger: new Logger(console.log.bind(console)),
		createPrompter: () => require('enquirer'),
		debug: !!process.env.DEBUG,
		exec: (action, body) => {
			const opts = body && body.length > 0 ? { input: body } : {};
			return command(action, { ...opts, shell: true });
		}
	});
}

(async () => {
	await hygenInit();
})();