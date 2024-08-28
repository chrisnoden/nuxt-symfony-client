import type { H3Event } from 'h3';
import { FetchError } from 'ofetch';
import { toLower } from 'lodash-es';

/**
 * We do an auth check on SSR as belt and braces, to ensure the user session is valid before any
 * data "might" be exposed
 */
export default defineEventHandler(async (event: H3Event) => {
    const sessionId = getCookie(event, 'PHPSESSID');
    const uriParts = event.path.replace(/^\//, '').split('?');
    const path = toLower(uriParts[0]);
    if (path.substring(0, 4) === 'api/' || path.substring(0, 6) === '_nuxt/' || path.substring(0, 6) === '__nuxt') {
        return;
    }
    const params = new URLSearchParams(uriParts[1]);

    const cookies: string[] = [];
    if (sessionId) {
        cookies.push(`PHPSESSID=${sessionId}`);
    }

    try {
        await $fetch(
            `https://localhost:3000/api/session/me`,
            {
                headers: {
                    Cookie: cookies.join('; '),
                },
            },
        )

        if (path === 'security/login') {
            // already logged in, no need to be on the login page
            return await sendRedirect(event, params.get('referer') ?? '/', 302);
        }
    } catch (e) {
        if (e instanceof FetchError) {
            if (path.substring(0, 9) === 'security/') {
                return;
            }

            return await sendRedirect(event, `/security/login?referer=${encodeURIComponent('/' + path)}`, 401);
        }
    }
})
