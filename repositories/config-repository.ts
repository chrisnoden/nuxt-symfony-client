import AbstractApiClient from '~~/repositories/abstract-api-client';

export default class ConfigRepository extends AbstractApiClient {
    fetch() {
        return super.get<ConfigType>('config')
    }
}
