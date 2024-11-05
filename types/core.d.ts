export {

};

declare global {
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
        companyName: string,
        enabled: boolean,
    }

    type ClientNewType = {
        id?: number,
        companyName?: string,
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

    type ValidationErrorType = {
        field: string,
        message: string,
    }
}
