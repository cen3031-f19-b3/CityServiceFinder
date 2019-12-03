import { GetBackendDomain } from './Backend';

export const GetMyEditableUsers = () => {
	return fetch(`${GetBackendDomain()}/api/users/list`, {credentials: 'include'})
		.then((data) => data.json())
		.catch(console.error)
}

export const GetSingleUser = (uid) => {
	return fetch(`${GetBackendDomain()}/api/users/${uid}`, {credentials: 'include'})
		.then((data) => data.json())
		.catch(console.error)
}

export const CreateUser = (user) => {
	return fetch(`${GetBackendDomain()}/api/users/register`, {
		method: 'POST',
		credentials: 'include',
		headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
}

export const UpdateUser = (user) => {
	return fetch(`${GetBackendDomain()}/api/users/${user._id}`, {
		method: 'POST',
		credentials: 'include',
		headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
		body: JSON.stringify(user)
	})
}

export const DeleteUser = (uid) => {
	return fetch(`${GetBackendDomain()}/api/users/${uid}`, {
		method: 'DELETE',
		credentials: 'include'
	})
}