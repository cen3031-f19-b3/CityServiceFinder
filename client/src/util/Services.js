import { GetBackendDomain } from './Backend';

export const GetAllServices = () => {
    return fetch(`${GetBackendDomain()}/api/services/get`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
};
