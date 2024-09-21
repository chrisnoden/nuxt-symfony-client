import AbstractApiClient from '~~/repositories/abstract-api-client';

export default class UserRepository extends AbstractApiClient implements DataTableAwareApiClientContract<UserType> {
    entity(): string {
        return 'user';
    }

    create(user: UserNewType): Promise<UserType> {
        return super.put<UserType>(`user`, user);
    }

    find(userId: string): Promise<UserType|undefined> {
        return super.get<UserType>(`user/${userId}`);
    }

    search(query?: Record<string, string>, page?: number, perPage?: number, order?: string) {
        return super.getPaginated<UserType>(
            'users',
            query,
            page,
            perPage,
            order,
        )
    }

    update(user: UserType): Promise<UserType> {
        return super.post<UserType>(`user/${user.id}`, user);
    }
}
