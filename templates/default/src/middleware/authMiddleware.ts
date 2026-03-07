/**
 * authMiddleware.ts
 * Copyright(c) 2025 Aaron Hedges <aaron@dashron.com>
 * MIT Licensed
 *
 * This file exposes middleware that handles authentication via signed JWT session cookies.
 * It follows Passport.js-style patterns (verify credentials → serialize user into session)
 * but is implemented natively for the Roads.js context system without Express coupling.
 *
 * Usage in routes:
 *   router.addRoute<AuthContext>('POST', '/login', async function () {
 *     const user = await verifyCredentials(this.body.username, this.body.password);
 *     if (!user) return new Response('Unauthorized', 401);
 *     this.login(user.id);
 *     return new Response('', 302, { location: '/' });
 *   });
 *
 *   router.addRoute<AuthContext>('POST', '/logout', async function () {
 *     this.logout();
 *     return new Response('', 302, { location: '/' });
 *   });
 */
import { Context, Middleware, CookieMiddleware, StoreValsMiddleware } from 'roads';
import jwt from 'jsonwebtoken';

const DEFAULT_SESSION_EXPIRY = '7d';
const DEFAULT_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AuthContext extends Context {
	/** The authenticated user's ID, or undefined if not logged in. */
	userID: string | undefined;
	/**
	 * Log the user in: signs a session JWT, sets the session cookie, and updates context.
	 * Call this after verifying credentials (e.g. bcrypt password check, OAuth callback).
	 */
	login: (userID: string) => void;
	/** Log the user out by expiring the session cookie and clearing context. */
	logout: () => void;
}

export function buildAuthMiddleware(
	sessionSecret: string,
	sessionCookieName: string,
	sessionExpiresIn: string = DEFAULT_SESSION_EXPIRY
) {
	const authMiddleware: Middleware<
		AuthContext &
		CookieMiddleware.CookieContext &
		StoreValsMiddleware.StoreValsContext
	> = function authMiddleware(method, url, body, headers, next) {
		this.userID = undefined;

		const sessionCookie = this.getCookies()[sessionCookieName];
		if (sessionCookie) {
			try {
				const decoded = jwt.verify(sessionCookie, sessionSecret);
				if (decoded && typeof decoded === 'object' && typeof decoded.userID === 'string') {
					this.userID = decoded.userID;
				}
			} catch {
				// Expired or tampered token — treat as logged out
			}
		}

		this.storeVal('loggedIn', this.userID !== undefined);

		this.login = (userID: string) => {
			const token = jwt.sign({ userID }, sessionSecret, { expiresIn: sessionExpiresIn });
			this.setCookie(sessionCookieName, token, {
				httpOnly: true,
				sameSite: 'strict',
				maxAge: DEFAULT_COOKIE_MAX_AGE_SECONDS,
				path: '/'
			});
			this.userID = userID;
			this.storeVal('loggedIn', true);
		};

		this.logout = () => {
			this.setCookie(sessionCookieName, '', {
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 0,
				path: '/'
			});
			this.userID = undefined;
			this.storeVal('loggedIn', false);
		};

		return next();
	};

	return authMiddleware;
}
