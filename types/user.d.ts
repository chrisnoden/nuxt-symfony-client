import type { ClientType } from '~~/types/core';

export {

};

declare global {
    type TwoFactorMethodType = 'disabled' | 'magic-link' | 'google-authenticator';

    type RoleType = {
        name: string,
        description: string,
        role: Roles,
    }

    type Roles = 'ROLE_USER' | 'ROLE_USER_ADMINISTRATION' | 'ROLE_CLIENT_ADMINISTRATION';

    type UserType = {
        id: string,
        client: ClientType,
        name: string,
        email: string,
        roles: Roles[],
        active: boolean,
        enabled: boolean,
        twoFactorEnabled: boolean,
        twoFactorMethod: TwoFactorMethodType,
    }

    type UserNewType = {
        client?: ClientType,
        name?: string,
        email?: string,
        roles: Roles[],
        enabled: boolean,
    }
}
