import { defineStore } from 'pinia';

type State = {
    config: ConfigType | undefined,
}

export const useConfigStore = defineStore('config', {
    state: (): State => ({
        config: undefined,
    }),

    actions: {
        setConfig(config: ConfigType) {
            this.config = config;
        },
        $reset() {
            this.config = undefined;
        },
    },

    getters: {
        env(): string|undefined {
            return this.config?.env;
        },
    },

    persist: false,
})
