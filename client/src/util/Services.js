import { GetBackendDomain } from './Backend';

export const GetAllServices = () => {
    return fetch(`${GetBackendDomain()}/api/services/get`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
};

export const GetCategoryServices = (cat_id) => {
    return fetch(`${GetBackendDomain()}/api/categories/${cat_id}/services`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
}