import { GetBackendDomain } from './Backend'

export const GetAllCategories = () => {
    return fetch(`${GetBackendDomain()}/api/categories/get`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
}

export const GetSingleCategory = (cat_id) => {
    return fetch(`${GetBackendDomain()}/api/categories/${cat_id}`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
}

export const CreateCategory = (cat) => {
    return fetch(`${GetBackendDomain()}/api/categories/new`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cat)
    })
}

export const UpdateCategory = (cat) => {
    return fetch(`${GetBackendDomain()}/api/categories/${cat._id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cat)
    })
}

export const DeleteCategory = (cat_id) => {
    return fetch(`${GetBackendDomain()}/api/categories/${cat_id}`, {
        method: 'DELETE'
    })
}