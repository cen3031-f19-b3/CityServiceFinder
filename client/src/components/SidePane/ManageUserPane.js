import React, { useState, useEffect, useCallback } from 'react'

import { GetSingleUser, UpdateUser, CreateUser, DeleteUser } from '../../util/Users'

import SearchableList from '../SearchableList/SearchableList'

async function fetch_user(uid){
	return await GetSingleUser(uid)
}

async function do_delete(uid, done_callback){
	await DeleteUser(uid)

	done_callback()
}

async function commit_changes(new_user, in_progress_set, commit_callback, create_new){
	in_progress_set(true)

	if(create_new){
		await CreateUser(new_user)
	}else{
		await UpdateUser(new_user)
	}
	
	in_progress_set(false)

	commit_callback()
}

function MUPEntry({name, initial_value, fref, placeholder, info_text, is_password}){
	return (
		<tr>
			<td>
				<h2>{name}</h2>
			</td>
			<td>
				<input type={is_password ? "password" : "text"} defaultValue={initial_value} ref={fref} placeholder={placeholder} />
			</td>
			<td>
				<i className="fal fa-info-circle" title={info_text} />
			</td>
		</tr>
	)
}

function ManageUserPane({uid, check_auth, commit_callback}){
	const [user, set_user] = useState(null)

	const [uname, set_uname] = useState(null)
	const [uemail, set_uemail] = useState(null)
	const [upassword, set_upassword] = useState(null)
	const [roles, set_roles] = useState([])

	const [del_confirm, set_del_confirm] = useState(null)
	const [del_confirm_val, set_del_confirm_val] = useState(null)

	const [ract, set_ract] = useState(null)
	const [rctx, set_rctx] = useState(null)

	const [commit_in_progress, set_cip] = useState(false)

	const on_user_change = useCallback(() => {
		if(uid){
			fetch_user(uid)
				.then((new_user) => {
					if(uname){uname.value = new_user.name}
					if(uemail){uemail.value = new_user.email}
					set_user(new_user)
					set_roles(new_user.roles)
				})
				.catch(console.error)
		}else{
			if(uname){uname.value = ""}
			if(uemail){uemail.value = ""}
			set_user({
				name: "",
				email: ""
			})
		}
	}, [uid, uname, uemail])
	useEffect(on_user_change, [uid])

	if(!user){
		return <div className="manage-user-pane"><h1>Manage User</h1><h2>Loading...</h2></div>
	}

	const submit_role = (event) => {
		if(event && !(event.key === "Enter")){return}
		if(ract && ract.value && rctx && rctx.value){
			const new_roles = roles.concat({action: ract.value, context: rctx.value})
			set_roles(new_roles)
			ract.value = ""
			rctx.value = ""
		}
	}

	const role_input = <table>
		<tbody>
			<tr>
				<td><input type="text" onKeyPress={submit_role} placeholder="action" ref={set_ract} /></td>
				<td><i className="fal fa-at fa-2x" /></td>
				<td><input type="text" onKeyPress={submit_role} placeholder="context" ref={set_rctx} /></td>
				<td style={{cursor: "pointer", color: "#074b69"}} onClick={() => submit_role(null)}><i className="fal fa-plus-circle fa-2x" /></td>
			</tr>
		</tbody>
	</table>

	const roles_list = roles 
		? roles.map((role) => {return {
			contents: <span>{role.action}@{role.context}</span>,
			sort_on: `${role.action}@${role.context}`,
			action: role.action,
			context: role.context
		}})
		: null

	const role_box = roles.length > 0
		? <div style={{height: "10em", marginBottom: "2em"}}><SearchableList
			objects={roles_list}
			click_callback={(role_to_del) => {
				set_roles(roles.filter((role) => !(role.action === role_to_del.action && role.context === role_to_del.context)))
			}}
			selectable={false}
			multi_select={false}
		/></div>
		: <p style={{textAlign: "center"}}>No roles currently defined for {user.name}.</p>

	const btn_class = commit_in_progress ? "button button-disabled" : "button"
	const del_btn_class = (del_confirm_val && del_confirm_val === `DELETE ${user.name}`) ? "button danger-button" : "button button-disabled"

	const btn_onclick = () => {
		let new_user = {}
		if(uid){new_user._id = uid}
		if(uname && uname.value !== user.name){new_user.name = uname.value}
		if(uemail && uemail.value !== user.email){new_user.email = uemail.value}
		if(upassword && upassword.value){new_user.password = upassword.value}
		new_user.roles = roles
		commit_changes(new_user, set_cip, commit_callback, uid ? false : true)
	}

	const button = (!uid) 
		? <div className={btn_class} onClick={btn_onclick}><i className="fal fa-plus-circle" /> Create User</div>
		: <div className={btn_class} onClick={btn_onclick}><i className="fal fa-upload" /> Commit Changes</div>


	const danger_zone = <div className="danger-zone">
		<h2 style={{marginTop: "5em", color: "#e52207"}}>Danger Zone</h2>
		<p className="subtle-text">To permanently delete this user, enter "DELETE {user.name}" in the box below, then click the DELETE button.</p>
		<table>
			<tbody>
				<tr>
					<td>Delete User</td>
					<td><input type="text" ref={set_del_confirm} placeholder={`Enter DELETE ${user.name} to delete.`} onChange={() => set_del_confirm_val(del_confirm.value)} /></td>
					<td><div className={del_btn_class} onClick={() => {
						if(del_confirm_val && del_confirm_val === `DELETE ${user.name}`){do_delete(uid, commit_callback)}
					}}><i className="fal fa-minus-circle" /> DELETE</div></td>
				</tr>
			</tbody>
		</table>
	</div>

	const role_section = uid
		? <div>
			<h2>Roles</h2>
			<p className="subtle-text">
				These are the roles currently defined for {user.name}. To add a new role, type 
				it in the box below, in the form action@context and then press enter. To remove 
				a role, click its entry in the list below. For more	detailed documentation, visit
				<a 
					href="https://github.com/cen3031-f19-b3/CityServiceFinder/wiki/Role-Management"
				> the project wiki</a>.
			</p>
			{role_input}
			{role_box}
		</div>
		: null

	return(
		<div className="manage-user-pane">

			<h1>{uid ? `Manage ${user.name}` : "Create New User"}</h1>

			{uid ? <p className="subtle-text">User ID {user._id}</p> : null}

			<table>
				<tbody>
					<MUPEntry name="Full Name" initial_value={user.name} fref={set_uname} placeholder="Enter name" info_text="The full name of this user." />
					<MUPEntry name="E-mail" initial_value={user.email} fref={set_uemail} placeholder="Enter email address" info_text="The e-mail address which this user will use to log in." />
					<MUPEntry name="Password" initial_value="" fref={set_upassword} placeholder={uid ? "Change password" : "Enter Password"} info_text={uid ? "To change this user's password, enter a new value here. If this field is left blank, the user's password will not be changed." : "Enter a password for the new user."} is_password={true} />
				</tbody>
			</table>

			{role_section}

			{button}

			{uid ? danger_zone : null}

		</div>
	)
}

export default ManageUserPane