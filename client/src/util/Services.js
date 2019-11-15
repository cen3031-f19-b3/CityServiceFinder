const getBackendDomain = () => {
    if (process.env.NODE_ENV === "development") {
        return 'http://localhost:5000';
    } else {
        return window.location.origin;
    }
}

export const GetAllServices = () => {
    return fetch(`${getBackendDomain()}/api/services/get`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
};
