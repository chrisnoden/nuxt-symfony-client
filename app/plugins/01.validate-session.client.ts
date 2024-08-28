import type { Pinia } from 'pinia';
import { useSessionStore } from '~/stores/session-store';
import { FetchError } from 'ofetch';
import SecurityRepository from '~~/repositories/security-repository';

export default defineNuxtPlugin(nuxtApp => {
    const session = useSessionStore(nuxtApp.$pinia as Pinia);
    const security = new SecurityRepository();

    addRouteMiddleware('store-user-session', async (to) => {
        if (to.path.substring(0, 10) === '/security/' || to.path.substring(0, 5) === '/api/' || session.isLoggedIn) {
            return;
        }

        try {
            const user = await security.session();
            session.setSession(user);
        } catch (e) {
            if (e instanceof FetchError && e.statusCode === 429) {
                return navigateTo('/security/restricted')
            }

            session.$reset()
            return navigateTo('/security/login');
        }

        if (session.isLoggedIn) {
            return;
        }

        return navigateTo('/security/login');
    }, { global: true })
})
