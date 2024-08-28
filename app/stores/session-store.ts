import { defineStore } from 'pinia';
import { has, includes } from 'lodash-es';

type State = {
    session: UserType | undefined,
}

export const useSessionStore = defineStore('session', {
    state: (): State => ({
        session: undefined,
    }),

    actions: {
        setSession(session: UserType) {
            this.session = session;
        },
        hasRole(role: string): boolean {
            return includes(this.session?.roles ?? ['ROLE_USER'], role.toUpperCase());
        },
        $reset() {
            this.session = undefined;
        },
    },

    getters: {
        isLoggedIn(): boolean {
            return (undefined !== this.session && has(this.session, 'id'))
        },
        client(): { id: number, name: string, enabled: boolean, }|undefined {
            const c = this.session?.client;
            if (undefined === c) {
                return undefined;
            }

            return {
                id: c.id,
                name: c.name,
                enabled: c.enabled,
            }
        },
        email(): string|undefined {
            return this.session?.email;
        },
        name(): string|undefined {
            return this.session?.name;
        },
        roles(): string[] {
            return this.session?.roles ?? ['ROLE_USER'];
        },
        twoFactorEnabled(): boolean {
            return this.session?.twoFactorEnabled ?? false;
        },
        user(): UserType|undefined {
            if (undefined === this.session) {
                return undefined;
            }

            const su: UserType = this.session;

            return {
                id: su?.id,
                client: {
                    id: su.client.id,
                    name: su.client.name,
                    enabled: su.client.enabled,
                },
                name: su.name,
                email: su.email,
                roles: su.roles,
                active: su.active,
                enabled: su.enabled,
                twoFactorEnabled: su.twoFactorEnabled,
            }
        }
    },

    persist: false,
})
