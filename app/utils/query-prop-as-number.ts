import { isString } from 'lodash-es';

export const queryPropAsNumber = (name: string): number|undefined => {
    const route = useRoute();

    const value = Array.isArray(route.query[name]) ? route.query[name][0] : route.query[name];

    if (isString(value) && value.length > 0) {
        return parseInt(`${value}`, 10);
    }

    return undefined;
}
