import queryString from 'query-string';
import { forEach, has } from 'lodash-es';
import type { LocationQueryValue } from 'vue-router';

export const addPropertyToRouteQuery = async(property: string, value: boolean|number|string|undefined): Promise<void> => {
    const route = useRoute();
    const router = useRouter();

    const props: Record<string, LocationQueryValue|LocationQueryValue[]> = {};
    // get the current query
    forEach(route.query, (val,prop) => {
        if (prop === property) {
            if (undefined !== value) {
                props[property] = `${value}`;
            }
        } else {
            // retain existing props
            props[prop] = val;
        }
    })
    if (!has(props, property) && undefined !== value) {
        props[property] = `${value}`;
    }

    // update the browser URL
    const qs = queryString.stringify(props, { skipNull: true, skipEmptyString: true });
    const url = `?${qs}`;

    await router.replace(url);
}
