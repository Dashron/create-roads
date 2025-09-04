import { init, navigate } from './core/router';

init();

/**
 * Intercept all anchor tags and 
 */
document?.addEventListener('click', (event: MouseEvent) => {
	if ((event.target as HTMLLinkElement).tagName === 'A') {
		// Grab the real link attribute. The property `href` directly on the target will be the full URL
		const href = (event.target as HTMLLinkElement).getAttribute("href");

		// Make sure there's a link
		if (!href) {
			return;
		}

		// If the URL starts with `/` but not `//`, use the internal redirection
		if (href[0] === '/' && href[1] !== '/') {
			event.preventDefault();
			navigate(href);
		}
	}
});

navigate(window.location.pathname);