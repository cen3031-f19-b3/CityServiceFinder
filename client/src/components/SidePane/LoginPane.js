import React, {useState} from 'react';

import {Login} from '../../util/Auth';

async function do_login(
        uname, password,
        login_success_callback,
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
        login_success_callback()
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
            <p className="err-toast">Login incorrect! Please try again.</p>
        )
    }else{
        return(<p></p>)
    }
}

/* Displays a login screen - this should usually be displayed in a SidePane
 * 
 * login_success_callback is called when the user successfully logs in
 */
function LoginPane({login_success_callback}){

    const [uname, set_uname] = useState("")
    const [password, set_password] = useState("")
    const [pwd_inc, set_pwd_inc] = useState(false)
    const [login_in_progress, set_login_in_progress] = useState(false)

    var login_btn_class = "button"
    if(login_in_progress){
        login_btn_class = login_btn_class + " button-disabled"
    }

    return(
        <form className="login-pane" id="user-login-form">
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
                        login_success_callback,
                        set_pwd_inc,
                        login_in_progress,
                        set_login_in_progress
                    )}
            >
                <i className="fal fa-sign-in" /> Sign In
            </div>
        </form>
    )
}
export default LoginPane;