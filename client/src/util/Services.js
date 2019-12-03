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

export const GetService = (service_id) => {
    return fetch(`${GetBackendDomain()}/api/services/${service_id}`)
        .then((data) => data.json())
        .catch((e) => console.error(e));
};

export const ReportService = (service_id, message) => {
    return fetch(`${GetBackendDomain()}/api/services/${service_id}/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message})
    })
        .then((data) => data.json())
        .catch((e) => console.error(e));
};

export const CreateService = (service) => {
    return fetch(`${GetBackendDomain()}/api/services/new`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(service)
    })
}

export const UpdateService = (service) => {
    return fetch(`${GetBackendDomain()}/api/services/${service._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: service._id,
            update: service
        })
    })
}

export const DeleteService = (service) => {
    return fetch(`${GetBackendDomain()}/api/services/${service._id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
}