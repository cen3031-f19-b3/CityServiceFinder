import React, { useState } from 'react';

async function do_logout(user, set_logout_status, success_callback){
    set_logout_status(true)
    console.log(`Logout ${user.name}`)
    set_logout_status(false)
    success_callback()
}

function UserPane({user, logout_success_callback}){
    const [logout_in_progress, set_logout_in_progress] = useState(false)

    let btn_class = "button"
    if(logout_in_progress){btn_class += " button-disabled"}

    return(
        <div className="user-pane">
            <h1>{user.name}</h1>
            <div 
                className={btn_class}
                onClick={() => do_logout(
                    user, set_logout_in_progress, logout_success_callback
                )}
            >Logout</div>
        </div>
    )
}

export default UserPane