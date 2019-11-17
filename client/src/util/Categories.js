import { GetBackendDomain } from './Backend';

export const GetAllCategories = () => {
    return fetch(`${GetBackendDomain()}/api/categories/get`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
};
