import { intersection, isArray, isEmpty } from 'lodash-es';

export default function hasRole(role?: string | string[]): boolean {
    const session = useSessionStore();

    if (undefined === role || role === '' || (isArray(role) && isEmpty(role))) {
        return true;
    }

    if (isArray(role)) {
        return intersection(role, session.roles).length > 0;
    }

    return session.hasRole(`${role}`);
}
