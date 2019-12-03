import { GetBackendDomain } from './Backend';

/* Attempts to authenticate a user to the backend, using the provided username
 * and password.
 */
export const Login = (user, pass) => {
    return fetch(
            `${GetBackendDomain()}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: user,
                    password: pass
                })
            }
        )
        .then((data) => data.json())
        .catch((e) => console.error(e))
}

export const Logout = () => {
    return true
}

/* Returns  
 *
 */
export const GetUser = (other_user) => {
    if(other_user){
        return fetch(`${GetBackendDomain}/api/users/profile`, {credentials: 'include'})
            .then((data) => data.json())
            .catch((e) => console.error(e))
    }else{
        return fetch(`${GetBackendDomain}/api/users/profile`, {credentials: 'include'})
            .then((data) => data.json())
            .catch((e) => console.error(e))
    }
}

/* Returns a list of all roles for the specified user. Roles are given as an array
 * of dicts, formatted as
 * {
 *   action: "some_action",
 *   context: "/some/context"
 * }
 * 
 * where "action" is the specific action the user is allowed to take (e.g.
 * "create," "edit," "remove," etc.) and "context" is the context in which the
 * user is allowed to take that action (see comment on IsInContexf for more
 * on contexts)
 */
export const GetUserRoles = (user_id) => {
    return fetch(`${GetBackendDomain}/api/users/${user_id}/roles`)
        .then((data) => data.json())
        .catch((e) => console.error(e))
}

/* Checks whether a given role applies in a certain action's context
 * A role applies to an action if the action's context starts with the role's context.
 * 
 * Contexts are given in path form - for example, creating a category is considered a
 * "create" action in context "/cat" - thus, a role granting "create" on "/cat" would
 * be in context, as would a role granting "create" on "/", but a role granting
 * "create" on "/cat/1156151" would not.
 */
export const IsInContext = (role, context, permissive) => {
    if(permissive){
        return role.context.substring(0, context.length) === context || context.substring(0,role.context.length) === role.context
    }else{
        return context.substring(0,role.context.length) === role.context
    }
}

/* A simple front-end permissions check.
 * This should ONLY be used to determine whether to show admin UI elements -
 * all actions must be validated on the backend!
 */
export const CanUserDo = (user, action, context, permissive) => {
    var role_works = false
    user.roles.forEach((role) => {
        if(
            IsInContext(role, context, permissive) &&
            (role.action === action || role.action === "administrator" || action === "any")
        ){
            role_works = true
        }
    })
    return role_works
}

/* Determines whether a given user has the "administrator@/" role
 */
export const IsUserAdmin = (user) => {
	let is_admin = false
	user.roles.forEach((role) => {
		if(role.action === "administrator" && role.context === "/"){
			is_admin = true
		}
	})
	return is_admin
}