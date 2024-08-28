import { has, isObject } from 'lodash-es';

export const isMaintenanceMode = ():boolean => {
    const env = useRuntimeConfig();

    if (has(env, 'public') && isObject(env.public)) {
        return (['true', 't', '1', 'yes'].includes(`${env.public.MAINTENANCE}`.toLowerCase()));
    }

    return (['true', 't', '1', 'yes'].includes(`${env.MAINTENANCE}`.toLowerCase()));
}
