export {

};

declare global {
    interface DataTableAwareApiClientContract<T> {
        search(
            query?: { [key: string]: string | number | null, },
            page?: number,
            perPage?: number,
            order?: string
        ): Promise<{ data: T[], meta: ApiMetaType }>
    }

    type ApiStandardResponse = {
        message: string,
    }

    type ApiMetaType = {
        pagination: ApiPaginationType,
    }

    type ApiPaginationType = {
        total: number,
        count: number,
        per_page: number,
        current_page: number,
        total_pages: number,
        links: string[],
    }

    type ClientType = {
        id: number,
        name: string,
        enabled: boolean,
    }

    type ConfigType = {
        env: string,
    }

    type LoginFormType = {
        email: string,
        password: string,
        rememberMe: boolean,
    }

    type UserType = {
        id: string,
        client: {
            id: number,
            name: string,
            enabled: boolean,
        },
        name: string,
        email: string,
        roles: string[],
        active: boolean,
        enabled: boolean,
        twoFactorEnabled: boolean,
    }

    type UserNewType = {
        client?: {
            id: number,
            name: string,
            enabled: boolean,
        },
        name?: string,
        email?: string,
        roles: string[],
        enabled: boolean,
    }

    type ValidationErrorType = {
        field: string,
        message: string,
    }
}
