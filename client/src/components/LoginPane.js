import React, {useState} from 'react';

import {Login} from '../util/Auth';
import './LoginPane.css';

async function do_login(
        uname, password,
        close_callback,
        set_pwd_inc,
        login_in_progress,
        set_in_progress_callback
    ){
    if(login_in_progress){
        return // Ignore multiple button presses
    }

    set_in_progress_callback(true)
    let res = await Login(uname, password)
    console.log(`Login result: ${res}`)
    set_in_progress_callback(false)
    if(res.success){
        set_pwd_inc(false)
        document.getElementById("user-login-form").reset()
        close_callback(true)
    }else{
        set_pwd_inc(true)
    }
}

/* Displays a "password incorrect" message to the user when they submit an
 * incorrect password
 * 
 * show_me controls whether the message should be visible or not.
 */
function PwdToast({show_me}){
    if(show_me){
        return(
            <p className="pwd-toast">Login incorrect! Please try again.</p>
        )
    }else{
        return(<p></p>)
    }
}

/* Displays a login pane on the right side of the screen.
 * 
 * Set is_displaying to show or hide the login pane (this is controlled by CSS)
 * close_callback is a callback function which takes a boolean. This will be 
 * false if the pane is closed without successfully logging in, or true if the
 * pane closes due to a successful login.
 */
function LoginPane({is_displaying, close_callback}){

    const [uname, set_uname] = useState("")
    const [password, set_password] = useState("")
    const [pwd_inc, set_pwd_inc] = useState(false)
    const [login_in_progress, set_login_in_progress] = useState(false)

    var login_pane_class = "login-pane"
    if(!is_displaying){
        login_pane_class = login_pane_class + " login-pane-hidden"
    }

    var login_btn_class = "login-button"
    if(login_in_progress){
        login_btn_class = login_btn_class + " login-button-disabled"
    }

    return(
        <div className={login_pane_class}>
        <form id="user-login-form">
            <i onClick={() => close_callback(false)} className="panel-close fal fa-times fa-2x" />
            <h1>Sign In</h1>
            <p>If you are an administrator or a service provider registered with the city, you can log in here to access administrative functionality.</p>
            <PwdToast show_me={pwd_inc} />
            <input
                type = "text"
                ref = {set_uname}
                placeholder = "Username"
            />
            <input
                type = "password"
                ref = {set_password}
                placeholder = "Password"
            />
            <div 
                className={login_btn_class}
                onClick={() => 
                    do_login(
                        uname.value, password.value,
                        close_callback,
                        set_pwd_inc,
                        login_in_progress,
                        set_login_in_progress
                    )}
            >
                <i className="fal fa-sign-in" /> Sign In
            </div>
            </form>
        </div>
    )
}
export default LoginPane;