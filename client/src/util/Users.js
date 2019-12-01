import { GetBackendDomain } from './Backend';

export const GetMyEditableUsers = () => {
	// This route isn't working yet
	/*return fetch(`${GetBackendDomain()}/api/users/get`)
		.then((data) => data.json())
		.catch((e) => console.error(e))*/
	
	return(new Promise((resolve, reject) => {
		resolve([
			{email: "joe", _id: 4694981516, roles: [{action: "administrator", context: "/"}]},
			{email: "linda", _id: 6598151321, roles: [{action: "edit", context: "/services/253459841650"}]},
			{email: "blinda", _id: 2343, roles: []},
			{email: "londor", _id: 2344, roles: []},
			{email: "shor", _id: 2345, roles: []},
			{email: "morn", _id: 2346, roles: []},
			{email: "ak", _id: 2347, roles: []},
			{email: "potato", _id: 2348, roles: []},
			{email: "bob", _id: 2349, roles: []},
			{email: "bob 2: revenge of bob", _id: 2350, roles: []},
			{email: "alice", _id: 2351, roles: [{action: "administrator", context: "/"}]},
			{email: "carol", _id: 2352, roles: []},
			{email: "eve", _id: 2353, roles: []},
			{email: "glinda", _id: 2354, roles: []},
			{email: "mlinda", _id: 2355, roles: []},
		])
	}))
};

