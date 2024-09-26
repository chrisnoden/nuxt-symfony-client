import AbstractApiClient from '~~/repositories/abstract-api-client';

export default class ClientRepository extends AbstractApiClient implements DataTableAwareApiClientContract<ClientType> {
    entity(): string {
        return 'client';
    }

    create(client: ClientNewType): Promise<ClientType> {
        return super.put<ClientType>(`client`, client);
    }

    find(clientId: number): Promise<ClientType|undefined> {
        return super.get<ClientType>(`client/${clientId}`);
    }

    search(query?: Record<string, string>, page?: number, perPage?: number) {
        return super.getPaginated<ClientType>(
            'clients',
            query,
            page,
            perPage,
        )
    }

    update(client: ClientType): Promise<ClientType> {
        return super.post<ClientType>(`client/${client.id}`, client);
    }
}
