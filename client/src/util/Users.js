// eslint-disable-next-line
import { GetBackendDomain } from './Backend';

export const GetMyEditableUsers = () => {
	return fetch(`${GetBackendDomain()}/api/users/list`, {credentials: 'include'})
		.then((data) => data.json())
		.catch(console.error)
};

export const GetSingleUser = () => {

}