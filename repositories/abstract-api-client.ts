import { handleApiError } from '~/utils/handle-api-error';
import { clone, merge } from 'lodash-es';

export default abstract class AbstractApiClient {
    private _cookieString(): string {
        const session = useCookie('PHPSESSID');
        const remember = useCookie('REMEMBERME');

        return [
            `PHPSESSID=${session.value}`,
            `REMEMBERME=${remember.value}`,
        ].join('; ');
    }

    protected get<T>(endpoint: string, params?: object, suppressErrorHandling?: boolean): Promise<T> {
        const { $csrfFetch } = useNuxtApp()

        return $csrfFetch(
            `/api/${endpoint}`,
            {
                credentials: 'include',
                params,
                headers: {
                    Cookie: this._cookieString(),
                },
            },
        )
            .catch((error) => {
                if (!suppressErrorHandling) {
                    handleApiError(error);
                }

                throw error;
            }) as Promise<T>
    }

    protected getPaginated<T>(
        endpoint: string,
        filters?: object,
        page?: number,
        perPage?: number,
        order?: string,
    ): Promise<{ data: T[], meta: ApiMetaType }> {
        const { $csrfFetch } = useNuxtApp()

        const params = merge(clone(filters), {
            order: order ?? undefined,
            page: Math.abs(page ?? 1),
            per_page: Math.abs(perPage ?? 24),
        })

        return $csrfFetch(
            `/api/${endpoint}`,
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

    protected post<T>(endpoint:string, data?: object, suppressErrorHandling?: boolean): Promise<T> {
        const { $csrfFetch } = useNuxtApp()

        return $csrfFetch(
            `/api/${endpoint}`,
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
                if (!suppressErrorHandling) {
                    handleApiError(error);
                }

                throw error;
            }) as Promise<T>
    }

    protected put<T>(endpoint:string, data?: object, suppressErrorHandling?: boolean): Promise<T> {
        const { $csrfFetch } = useNuxtApp()

        return $csrfFetch(
            `/api/${endpoint}`,
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
                if (!suppressErrorHandling) {
                    handleApiError(error);
                }

                throw error;
            }) as Promise<T>
    }

    protected delete<T>(endpoint:string, params?: object, suppressErrorHandling?: boolean): Promise<T> {
        const { $csrfFetch } = useNuxtApp()

        return $csrfFetch(
            `/api/${endpoint}`,
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
                if (!suppressErrorHandling) {
                    handleApiError(error);
                }

                throw error;
            }) as Promise<T>
    }
}
