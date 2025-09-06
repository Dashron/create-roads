import { Args, Command, Flags } from '@oclif/core';
import path from 'node:path';
import prompts from 'prompts';

import { getTemplate, getTemplateNames, getTemplateChoices } from '../lib/templates.js';
import { formatTargetDir, isValidPackageName, toValidPackageName } from '../lib/validation.js';
import type { PackageManager } from '../lib/package-manager.js';
import { detectPackageManager, getPackageManagerCommands } from '../lib/package-manager.js';
import { ProjectScaffolder } from '../lib/project-scaffolder.js';
import { FileOperations } from '../lib/file-operations.js';

export default class CreateRoads extends Command {
	static override id = 'create-roads';
	static override description = 'Scaffolding tool for Roads.js applications';

	static override examples = [
		'<%= config.bin %> my-app',
		'<%= config.bin %> my-app --template spa',
		'<%= config.bin %> my-app --pm yarn --skip-install',
	];

	static override flags = {
		help: Flags.help(),
		template: Flags.string({
			char: 't',
			description: 'Template to use',
			options: getTemplateNames(),
		}),
		'package-manager': Flags.string({
			description: 'Package manager to use',
			options: ['npm', 'yarn', 'pnpm'],
		}),
		pm: Flags.string({
			description: 'Package manager to use (alias for --package-manager)',
			options: ['npm', 'yarn', 'pnpm'],
		}),
		'skip-install': Flags.boolean({
			description: 'Skip dependency installation',
			default: false,
		}),
		verbose: Flags.boolean({
			char: 'V',
			description: 'Enable verbose logging',
			default: false,
		}),
	};

	static override args = {
		projectName: Args.string({ description: 'Name of the project directory' }),
	};

	private verbose = false;

	public async run(): Promise<void> {
		const { args, flags } = await this.parse(CreateRoads);
		const fileOps = new FileOperations();
		const scaffolder = new ProjectScaffolder();

		this.verbose = flags.verbose;

		this.log();
		this.log('Welcome to create-roads!');
		this.log();

		const packageManager = (flags.pm || flags['package-manager'] ||
			detectPackageManager()) as PackageManager;

		let targetDir = formatTargetDir(args.projectName);
		let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' |
			'template'>;

		result = await prompts(
			[
				{
					type: args.projectName ? null : 'text',
					name: 'projectName',
					message: 'Project name:',
					initial: 'roads-app',
					onState: (state) => {
						targetDir = formatTargetDir(state.value) || 'roads-app';
					},
				},
				{
					type: () => fileOps.canSkipEmptyDir(targetDir) ? null : 'confirm',
					name: 'overwrite',
					message: () => `${targetDir === '.' ? 'Current directory' :
						`Target directory "${targetDir}"`} is not empty. Remove existing files and continue?`,
				},
				{
					type: (_, { overwrite }: { overwrite?: boolean }) => {
						if (overwrite === false) {
							throw new Error('✖ Operation cancelled');
						}
						return null;
					},
					name: 'overwriteChecker',
				},
				{
					type: () => (isValidPackageName(targetDir) ? null : 'text'),
					name: 'packageName',
					message: 'Package name:',
					initial: () => toValidPackageName(targetDir),
					validate: (dir) => isValidPackageName(dir) ||
						'Invalid package.json name',
				},
				{
					type: flags.template ? null : 'select',
					name: 'template',
					message: 'Select a template:',
					initial: 0,
					choices: getTemplateChoices(),
				},
			],
			{
				onCancel: () => {
					throw new Error('✖ Operation cancelled');
				},
			}
		);

		const { packageName, template } = result;
		const templateName = flags.template || template;

		const selectedTemplate = getTemplate(templateName);
		if (!selectedTemplate) {
			this.error(`Template "${templateName}" not found!`);
		}

		const finalPackageName = packageName || targetDir;

		try {
			const result = await scaffolder.scaffold({
				targetDir,
				template: selectedTemplate,
				packageName: finalPackageName,
				packageManager,
				skipInstall: flags['skip-install'],
				onProgress: this.showProgress.bind(this),
				verbose: this.verbose,
			});

			if (result.success) {
				if (flags['skip-install']) {
					this.showProgress('Project scaffolded successfully! 🎉', undefined, undefined, true);
				} else if (result.buildSuccess) {
					this.showProgress('Project created successfully! 🎉', undefined, undefined, true);
				} else if (result.installSuccess) {
					this.showProgress('Project created, but build failed ⚠️', undefined, undefined, true);
					if (result.buildError) {
						this.log('\nBuild error output:');
						this.log(result.buildError.trim());
					}
				} else {
					this.showProgress('Project created, but dependency installation failed ⚠️', undefined, undefined, true);
				}
			}

			this.log('\nDone. Now run:\n');
			if (result.root !== process.cwd()) {
				this.log(`  cd ${path.relative(process.cwd(), result.root)}`);
			}

			const pmCommands = getPackageManagerCommands(packageManager);
			if (!result.installSuccess) {
				this.log(`  ${pmCommands.install}`);
			}

			this.log(`  ${pmCommands.run} watch-all`);
			this.log();
		} catch (error) {
			this.error(error instanceof Error ? error.message :
				'Unknown error occurred');
		}
	}



	private showProgress(message: string, step?: number,
		total?: number, force = false): void {
		// Always show step progress (1/6, 2/6 format), but respect verbose for other messages
		const hasStepInfo = step && total;
		if (!this.verbose && !force && !hasStepInfo) {
			return;
		}
		const prefix = hasStepInfo ? `[${step}/${total}]` : '•';
		this.log(`${prefix} ${message}`);
	}

}