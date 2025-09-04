import { Args, Command, Flags } from '@oclif/core'
import path from 'node:path'
import fs from 'node:fs'
import { spawn } from 'node:child_process'
import prompts from 'prompts'
import { minimatch } from 'minimatch'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Template {
  name: string
  display: string
  color: string
  variant: string
  excludeFiles?: string[]
  includeFiles?: string[]
}

interface TemplateVariables {
  projectName: string
  packageName: string
  description?: string
  author?: string
}

type PackageManager = 'npm' | 'yarn' | 'pnpm'

const TEMPLATES: Template[] = [
  {
    name: 'default',
    display: 'SSR (Server-Side Rendering)',
    color: 'blue',
    variant: 'ssr',
    excludeFiles: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'types/**',
      '*.js.map',
      '*.d.ts.map',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'public/dist-js/**'
    ]
  },
  {
    name: 'spa',
    display: 'SPA (Single Page Application)',
    color: 'green',
    variant: 'spa',
    excludeFiles: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'types/**',
      '*.js.map',
      '*.d.ts.map',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'public/js/main.js'
    ]
  }
]

export default class CreateRoads extends Command {
  static override id = 'create-roads'
  static override description = 'Scaffolding tool for Roads.js applications'

  static override examples = [
    '<%= config.bin %> my-app',
    '<%= config.bin %> my-app --template spa',
    '<%= config.bin %> my-app --pm yarn --skip-install',
  ]

  static override flags = {
    help: Flags.help(),
    template: Flags.string({
      char: 't',
      description: 'Template to use',
      options: ['default', 'spa'],
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
  }

  static override args = {
    projectName: Args.string({ description: 'Name of the project directory' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(CreateRoads)

    this.log()
    this.log('Welcome to create-roads!')
    this.log()

    const packageManager = (flags.pm || flags['package-manager'] || this.detectPackageManager()) as PackageManager
    
    let targetDir = this.formatTargetDir(args.projectName)
    let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'template'>

    result = await prompts(
      [
        {
          type: args.projectName ? null : 'text',
          name: 'projectName',
          message: 'Project name:',
          initial: 'roads-app',
          onState: (state) => {
            targetDir = this.formatTargetDir(state.value) || 'roads-app'
          },
        },
        {
          type: () => this.canSkipEmptyDir(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () => (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error('✖ Operation cancelled')
            }
            return null
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (this.isValidPackageName(targetDir) ? null : 'text'),
          name: 'packageName',
          message: 'Package name:',
          initial: () => this.toValidPackageName(targetDir),
          validate: (dir) => this.isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: flags.template ? null : 'select',
          name: 'template',
          message: 'Select a template:',
          initial: 0,
          choices: TEMPLATES.map((template) => {
            return {
              title: template.display,
              value: template.name,
            }
          }),
        },
      ],
      {
        onCancel: () => {
          throw new Error('✖ Operation cancelled')
        },
      }
    )

    const { overwrite, packageName, template } = result
    const templateName = flags.template || template

    const selectedTemplate = TEMPLATES.find(t => t.name === templateName)
    if (!selectedTemplate) {
      this.error(`Template "${templateName}" not found!`)
    }

    const root = path.join(process.cwd(), targetDir)
    const totalSteps = templateName === 'default' ? 6 : 5

    if (overwrite) {
      this.showProgress('Cleaning target directory...', 1, totalSteps)
      this.emptyDir(root)
    } else if (!fs.existsSync(root)) {
      this.showProgress('Creating project directory...', 1, totalSteps)
      fs.mkdirSync(root, { recursive: true })
    }

    this.showProgress(`Scaffolding ${selectedTemplate.display} project in ${root}...`, 2, totalSteps)

    const templateRoot = path.resolve(__dirname, '..', '..', 'templates', templateName)

    if (!fs.existsSync(templateRoot)) {
      this.error(`Template "${templateName}" not found!`)
    }

    const variables: TemplateVariables = {
      projectName: targetDir,
      packageName: packageName || targetDir,
      description: `A new ${selectedTemplate.display} application`,
      author: ''
    }

    const write = (file: string, content?: string) => {
      const targetPath = path.join(root, file)
      if (content) {
        fs.writeFileSync(targetPath, content)
      } else {
        this.copy(path.join(templateRoot, file), targetPath, selectedTemplate, variables, file)
      }
    }

    const files = fs.readdirSync(templateRoot)
    for (const file of files.filter((f) => f !== 'package.json')) {
      if (this.shouldExcludeFile(file, selectedTemplate)) {
        continue
      }
      if (!this.shouldIncludeFile(file, selectedTemplate)) {
        continue
      }
      write(file)
    }

    const pkg = JSON.parse(fs.readFileSync(path.join(templateRoot, 'package.json'), 'utf-8'))

    pkg.name = packageName || targetDir
    pkg.description = variables.description
    pkg.version = "0.1.0"

    delete pkg.author
    delete pkg.main
    delete pkg.types
    delete pkg.files

    this.showProgress('Generating package.json...', 3, totalSteps)
    write('package.json', JSON.stringify(pkg, null, 2) + '\n')

    if (flags['skip-install']) {
      this.showProgress('Project scaffolded successfully! 🎉')
      this.log(`\nDone. Now run:\n`)
      if (root !== process.cwd()) {
        this.log(`  cd ${path.relative(process.cwd(), root)}`)
      }

      const pmCommands = this.getPackageManagerCommands(packageManager)
      this.log(`  ${pmCommands.install}`)
      this.log(`  ${pmCommands.run} watch-all`)
      this.log()
      return
    }

    const pmCommands = this.getPackageManagerCommands(packageManager)

    this.showProgress(`Installing dependencies with ${packageManager}...`, 4, totalSteps)
    const installSuccess = await this.runCommand(
      pmCommands.install.split(' ')[0],
      pmCommands.install.split(' ').slice(1),
      root
    )

    if (installSuccess) {
      if (templateName === 'default') {
        this.showProgress('Creating dist-js directory...', 5, 6)
        const distJsPath = path.join(root, 'public', 'dist-js')
        fs.mkdirSync(distJsPath, { recursive: true })

        this.showProgress('Building TypeScript with npm run build-js...', 6, 6)
        const buildSuccess = await this.runCommand(
          pmCommands.run.split(' ')[0],
          [...pmCommands.run.split(' ').slice(1), 'build-js'],
          root
        )

        if (buildSuccess) {
          this.showProgress('Project created successfully! 🎉')
        } else {
          this.showProgress('Project created, but TypeScript build failed ⚠️')
        }
      } else if (templateName === 'spa') {
        this.showProgress('Building SPA with npm run build...', 5, 5)
        const buildSuccess = await this.runCommand(
          pmCommands.run.split(' ')[0],
          [...pmCommands.run.split(' ').slice(1), 'build'],
          root
        )

        if (buildSuccess) {
          this.showProgress('Project created successfully! 🎉')
        } else {
          this.showProgress('Project created, but build failed ⚠️')
        }
      } else {
        this.showProgress('Project created successfully! 🎉')
      }
    } else {
      this.showProgress('Project created, but dependency installation failed ⚠️')
    }

    this.log(`\nDone. Now run:\n`)
    if (root !== process.cwd()) {
      this.log(`  cd ${path.relative(process.cwd(), root)}`)
    }

    if (!installSuccess) {
      this.log(`  ${pmCommands.install}`)
    }

    this.log(`  ${pmCommands.run} watch-all`)
    this.log()
  }

  private formatTargetDir(targetDir: string | undefined): string {
    return targetDir?.trim().replace(/\/+$/g, '') || 'roads-app'
  }

  private isValidPackageName(projectName: string): boolean {
    return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
  }

  private toValidPackageName(projectName: string): string {
    return projectName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^[._]/, '')
      .replace(/[^a-z0-9-~]+/g, '-')
  }

  private canSkipEmptyDir(dir: string): boolean {
    if (!fs.existsSync(dir)) {
      return true
    }

    const files = fs.readdirSync(dir)
    if (files.length === 0) {
      return true
    }
    if (files.length === 1 && files[0] === '.git') {
      return true
    }

    return false
  }

  private shouldExcludeFile(filePath: string, template: Template): boolean {
    if (!template.excludeFiles) return false

    return template.excludeFiles.some(pattern =>
      minimatch(filePath, pattern, { dot: true })
    )
  }

  private shouldIncludeFile(filePath: string, template: Template): boolean {
    if (!template.includeFiles || template.includeFiles.length === 0) return true

    return template.includeFiles.some(pattern =>
      minimatch(filePath, pattern, { dot: true })
    )
  }

  private substituteVariables(content: string, variables: TemplateVariables): string {
    return content
      .replace(/{{projectName}}/g, variables.projectName)
      .replace(/{{packageName}}/g, variables.packageName)
      .replace(/{{description}}/g, variables.description || '')
      .replace(/{{author}}/g, variables.author || '')
  }

  private isTextFile(filePath: string): boolean {
    const textExtensions = [
      '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.html', '.css', '.scss',
      '.less', '.yaml', '.yml', '.xml', '.svg', '.gitignore', '.env'
    ]
    const ext = path.extname(filePath).toLowerCase()
    return textExtensions.includes(ext) || path.basename(filePath).startsWith('.')
  }

  private detectPackageManager(): PackageManager {
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
    if (fs.existsSync('yarn.lock')) return 'yarn'
    return 'npm'
  }

  private getPackageManagerCommands(pm: PackageManager) {
    switch (pm) {
      case 'yarn':
        return { install: 'yarn', add: 'yarn add', run: 'yarn' }
      case 'pnpm':
        return { install: 'pnpm install', add: 'pnpm add', run: 'pnpm' }
      case 'npm':
      default:
        return { install: 'npm install', add: 'npm install', run: 'npm run' }
    }
  }

  private showProgress(message: string, step?: number, total?: number): void {
    const prefix = step && total ? `[${step}/${total}]` : '•'
    this.log(`${prefix} ${message}`)
  }

  private async runCommand(command: string, args: string[], cwd: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.log(`\nRunning: ${command} ${args.join(' ')}`)
      const child = spawn(command, args, {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32'
      })

      child.on('close', (code) => {
        resolve(code === 0)
      })
    })
  }

  private copy(src: string, dest: string, template: Template, variables: TemplateVariables, relativePath: string = '') {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      this.copyDir(src, dest, template, variables, relativePath)
    } else {
      if (this.isTextFile(src)) {
        const content = fs.readFileSync(src, 'utf-8')
        const substituted = this.substituteVariables(content, variables)
        fs.writeFileSync(dest, substituted, 'utf-8')
      } else {
        fs.copyFileSync(src, dest)
      }
    }
  }

  private copyDir(srcDir: string, destDir: string, template: Template, variables: TemplateVariables, relativePath: string = '') {
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
      const currentRelativePath = relativePath ? `${relativePath}/${file}` : file

      if (this.shouldExcludeFile(currentRelativePath, template)) {
        continue
      }

      if (!this.shouldIncludeFile(currentRelativePath, template)) {
        continue
      }

      const srcFile = path.resolve(srcDir, file)
      const destFile = path.resolve(destDir, file)
      this.copy(srcFile, destFile, template, variables, currentRelativePath)
    }
  }

  private emptyDir(dir: string) {
    if (!fs.existsSync(dir)) {
      return
    }
    for (const file of fs.readdirSync(dir)) {
      if (file === '.git') {
        continue
      }
      fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
    }
  }
}