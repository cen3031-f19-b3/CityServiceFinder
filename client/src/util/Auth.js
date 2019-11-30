import { GetBackendDomain } from './Backend';

/* Attempts to authenticate a user to the backend, using the provided username
 * and password.
 */
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

/* Returns a list of all roles for the current user. Roles are given as an array
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
export const GetUserRoles = () => {
    return [{
        action: "administrator",
        context: "/"
    }] // For testing purposes only
}

/* Checks whether a given role applies in a certain action's context
 * A role applies to an action if the action's context starts with the role's context.
 * 
 * Contexts are given in path form - for example, creating a category is considered a
 * "create" action in context "/cat" - thus, a role granting "create" on "/cat" would
 * be in context, as would a role granting "create" on "/", but a role granting
 * "create" on "/cat/1156151" would not.
 */
export const IsInContext = (role, context) => {
    return context.substring(0,role.context.length) === role.context
}

/* A simple front-end permissions check.
 * This should ONLY be used to determine whether to show admin UI elements -
 * all actions must be validated on the backend!
 */
export const CanUserDo = (action, context) => {
    var role_works = false
    GetUserRoles().forEach((role) => {
        if(
            IsInContext(role, context) &&
            (role.action === action || role.action === "administrator")
        ){
            role_works = true
        }
    })
    return role_works
}