import React, { useState } from 'react';

import { CanUserDo, IsUserAdmin } from '../../util/Auth'

async function do_logout(user, set_logout_status, success_callback){
    set_logout_status(true)
    console.log(`Logout ${user.name}`)
    set_logout_status(false)
    success_callback()
}

function UserPane({user, logout_success_callback}){
    const [logout_in_progress, set_logout_in_progress] = useState(false)

    const user_icon = (IsUserAdmin(user)) ? <i className="fal fa-user-crown" /> : <i className="fal fa-user" />
    const btn_class = (logout_in_progress) ? "button button-disabled" : "button"
    
    let user_manage = null
    if(CanUserDo("any", "/users", true)){
        user_manage = <div
            className="button"
            onClick={() => window.location.assign("/users")}
        ><i className="fal fa-cog" /> Manage Users</div>
    }

    return(
        <div className="user-pane">
            <h1>{user_icon} {user.name}</h1>
            {user_manage}
            <div 
                className={btn_class}
                onClick={() => do_logout(
                    user, set_logout_in_progress, logout_success_callback
                )}
            ><i className="fal fa-sign-out" /> Logout</div>
        </div>
    )
}

export default UserPane