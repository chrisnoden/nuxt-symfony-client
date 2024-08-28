import { has } from 'lodash-es';

export const $env = (name: string) => {
    try {
        const env = useRuntimeConfig();

        if (has(env, 'public') && has(env.public, name))
            return env.public[name];
        else if (has(env, name))
            return env[name];
    } catch (e) { /* empty */ }

    return process.env[name]
}
