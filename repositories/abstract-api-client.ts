import { handleApiError } from '~/utils/handle-api-error';
import { merge } from 'lodash-es';

export default abstract class AbstractApiClient {
    private _cookieString(): string {
        const session = useCookie('PHPSESSID');
        const remember = useCookie('REMEMBERME');

        return [
            `PHPSESSID=${session.value}`,
            `REMEMBERME=${remember.value}`,
        ].join('; ');
    }

    protected get<T>(endpoint: string, params?: object): Promise<T> {
        const env = useRuntimeConfig();

        return $fetch(
            `${env.public.API_URL}/${endpoint}`,
            {
                credentials: 'include',
                params,
                headers: {
                    Cookie: this._cookieString(),
                },
            },
        )
            .catch((error) => {
                handleApiError(error);

                throw error;
            }) as Promise<T>
    }

    protected getPaginated<T>(
        endpoint: string,
        query?: object,
        page?: number,
        perPage?: number,
        order?: string,
    ): Promise<{ data: T[], meta: ApiMetaType }> {
        const env = useRuntimeConfig();

        const params = merge(query, {
            order: order ?? undefined,
            page: page ?? 1,
            per_page: perPage ?? parseInt(`${env.public.TABLE_PER_PAGE_DEFAULT ?? 25}`, 10),
        })

        return $fetch(
            `${env.public.API_URL}/${endpoint}`,
            {
                credentials: 'include',
                params,
                headers: {
                    Cookie: this._cookieString(),
                },
            },
        )
            .catch((error) => {
                handleApiError(error);
            }) as Promise<{ data: T[], meta: ApiMetaType }>
    }

    protected post<T>(endpoint:string, data?: object): Promise<T> {
        const { $csrfFetch } = useNuxtApp()
        const env = useRuntimeConfig();

        return $csrfFetch(
            `${env.public.API_URL}/${endpoint}`,
            {
                body: data,
                credentials: 'include',
                method: 'POST',
                headers: {
                    Cookie: this._cookieString(),
                },
            }
        )
            .catch((error) => {
                handleApiError(error);

                throw error;
            }) as Promise<T>
    }

    protected put<T>(endpoint:string, data?: object): Promise<T> {
        const { $csrfFetch } = useNuxtApp()
        const env = useRuntimeConfig();

        return $csrfFetch(
            `${env.public.API_URL}/${endpoint}`,
            {
                body: data,
                credentials: 'include',
                method: 'PUT',
                headers: {
                    Cookie: this._cookieString(),
                },
            }
        )
            .catch((error) => {
                handleApiError(error);

                throw error;
            }) as Promise<T>
    }

    protected delete<T>(endpoint:string, params?: object): Promise<T> {
        const { $csrfFetch } = useNuxtApp()
        const env = useRuntimeConfig();

        return $csrfFetch(
            `${env.public.API_URL}/${endpoint}`,
            {
                credentials: 'include',
                params,
                method: 'DELETE',
                headers: {
                    Cookie: this._cookieString(),
                },
            }
        )
            .catch((error) => {
                handleApiError(error);

                throw error;
            }) as Promise<T>
    }
}
