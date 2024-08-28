import AbstractApiClient from '~~/repositories/abstract-api-client';

export default class ClientRepository extends AbstractApiClient {
    search(query?: Record<string, string>, page?: number, perPage?: number) {
        return super.getPaginated<ClientType>(
            'clients',
            query,
            page,
            perPage,
        )
    }
}
