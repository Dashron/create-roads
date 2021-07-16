
import * as Handlebars from 'handlebars';

Handlebars.registerHelper('ifEquals', function (
	this: unknown, arg1: unknown, arg2: unknown, options: Handlebars.HelperOptions
) {
	return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const c = (template: string) => Handlebars.compile(template);

export class TemplateLoader {
	cachedTemplates: {
		[key: string]: (params: unknown) => string
	}

	loaders: {
		[key: string]: () => (params: unknown) => string
	}

	cachingEnabled: boolean;

	constructor() {
		this.loaders = {};

		for (const key in this.loaders) {
			this.cachedTemplates[key] = this.loaders[key]();
		}
	}

	setCachingDisabled(disabled: boolean): void {
		this.cachingEnabled = !disabled;
	}

	compile (contents: string): (params: unknown) => string {
		return c(contents);
	}

	add(name: string, loader: () => (params: unknown) => string): void {
		this.loaders[name] = loader;
	}

	getTemplate(template: string): (params: unknown) => string {
		if (this.cachingEnabled) {
			if (this.cachedTemplates[template]) {
				return this.cachedTemplates[template];
			} else {
				throw new Error(`Template [${  template  }] not found`);
			}
		}

		if (this.loaders[template]) {
			return this.loaders[template]();
		} else {
			throw new Error(`Template [${  template  }] not found`);
		}
	}
}

const templateLoader = new TemplateLoader();
// temporary. don't do this once moved to roads-starter. In that, it should be passed around
export default templateLoader;