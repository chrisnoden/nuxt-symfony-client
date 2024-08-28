import { isString } from 'lodash-es';

export const queryPropAsString = (name: string): string|undefined => {
    const route = useRoute();

    const value = Array.isArray(route.query[name]) ? route.query[name][0] : route.query[name];

    if (isString(value) && value.length > 0) {
        return `${value}`;
    }

    return undefined;
}
