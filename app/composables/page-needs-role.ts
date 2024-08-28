import { intersection, isArray } from 'lodash-es';

export default async function pageNeedsRole(role: string | string[]) {
    if (import.meta.server) {
        return;
    }

    const session = useSessionStore();

    let hasAuthorisation = false;

    if (isArray(role)) {
        hasAuthorisation = intersection(role, session.roles).length > 0;
    } else {
        hasAuthorisation = session.hasRole(`${role}`);
    }

    if (!hasAuthorisation) {
        await navigateTo('/');
    }
}
