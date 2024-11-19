import AbstractApiClient from '~~/repositories/abstract-api-client';

type LoginResponse = {
    login: string,
    two_factor_complete?: boolean,
    two_factor_required: boolean,
    two_factor_method: 'disabled'|'google-authenticator'|'magic-link',
}

export default class SecurityRepository extends AbstractApiClient{
    disableTwoFactor(password: string): Promise<ApiStandardResponse> {
        return super.post(
            'security/2fa/disable',
            {
                password,
            }
        )
    }

    enableTwoFactor(method: TwoFactorMethodType, authCode?: string): Promise<ApiStandardResponse> {
        return super.post(
            'security/2fa/enable',
            {
                method,
                authCode,
            }
        )
    }

    login(email: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
        const env = useRuntimeConfig();
        const { $csrfFetch } = useNuxtApp()

        return $csrfFetch(
            `${env.public.API_URL}/login`,
            {
                body: {
                    email,
                    password,
                    _remember_me: rememberMe,
                },
                credentials: 'include',
                method: 'POST',
            }
        )
    }

    logout(): Promise<UserType> {
        return super.get('logout')
    }

    resetPasswordBegin(email: string): Promise<ApiStandardResponse> {
        const env = useRuntimeConfig();
        const { $csrfFetch } = useNuxtApp()

        return $csrfFetch(
            `${env.public.API_URL}/security/reset-password/begin`,
            {
                body: {
                    email,
                },
                credentials: 'include',
                method: 'POST',
            }
        )
    }

    resetPasswordReset(token: string, password: string): Promise<ApiStandardResponse> {
        const env = useRuntimeConfig();
        const { $csrfFetch } = useNuxtApp()

        return $csrfFetch(
            `${env.public.API_URL}/security/reset-password/reset`,
            {
                body: {
                    token,
                    password,
                },
                credentials: 'include',
                method: 'POST',
            }
        )
    }

    session(): Promise<UserType> {
        const env = useRuntimeConfig();

        return $fetch(
            `${env.public.API_URL}/session/me`,
            {
                credentials: 'include',
            },
        )
    }

    twoFactorAuth(code: string): Promise<LoginResponse> {
        return super.post(
            'two_factor_auth', {
                _auth_code: code,
            }
        )
    }

    setUserEmail(email: string, password: string): Promise<UserType> {
        return super.post(
            'session/me', {
                email,
                password,
            }
        )
    }

    confirmEmail(token: string): Promise<UserType> {
        return super.post(
            'security/confirm-email', {
                token,
            }
        )
    }

    setUserName(name: string, password: string): Promise<UserType> {
        return super.post(
            'session/me', {
                name,
                password,
            }
        )
    }

    setUserPassword(password: string, newPassword: string): Promise<UserType> {
        return super.post(
            'session/me', {
                newPassword,
                password,
            }
        )
    }
}
