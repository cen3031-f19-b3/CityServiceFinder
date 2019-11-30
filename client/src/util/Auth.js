import { GetBackendDomain } from './Backend';

export const Login = (user, pass) => {
    return fetch(
        `${GetBackendDomain()}/api/users/login`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user,
                password: pass
            })
        }
    )
        .then((data) => data.json())
        .catch((e) => console.error(e))
};
