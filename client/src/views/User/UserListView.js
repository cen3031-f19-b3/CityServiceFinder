import React, { useState } from 'react'

import { GetMyEditableUsers } from '../../util/Users'
import { CanUserDo, IsUserAdmin } from '../../util/Auth'

import LoginPane from '../../components/SidePane/LoginPane'
import SearchableList from '../../components/SearchableList/SearchableList'

import './UserListView.css'

function UserListView({logged_in_user, side_pane_open_callback}){
	const [users, set_users] = useState(null)
	const [load_done, set_load_done] = useState(false)

	let login_prompted = false

	if(!logged_in_user){
		/*if(!login_prompted){
			side_pane_open_callback(<LoginPane 
				login_success_callback={() => {
					window.location.reload(true)
				}}
			/>)
			login_prompted = true
		}*/

		return (<div className="user-list-view">
			<h1>Login Required</h1>
			<p>You must be logged in to view this page.</p>
		</div>)
	}

	if(!load_done){
		GetMyEditableUsers()
			.then((the_users) => {
				set_users(the_users)
				set_load_done(true)
			})
			.catch((e) => console.error(e))
		
		return (<div className="user-list-view">
			<h1>Loading...</h1>
		</div>)
	}

	let list_items = users.map((usr) => {
		const usr_icon = (IsUserAdmin(usr)) ? <i className="fal fa-user-crown" /> : <i className="fal fa-user" />
		return {contents: <span>{usr_icon} {usr.email}</span>, search_on: usr.email + usr._id, _id: usr._id}
	})

	if(CanUserDo("create", "/users")){
		list_items.push({contents: <span><i className="fal fa-plus-circle" /> Create New User</span>, search_on: "create new user", _id: null, special: "create"})
	}

	return(<div className="user-list-view">
		<h1>Manage Users</h1>
		<SearchableList 
			objects={list_items}
			click_callback={(clicked, selected) => {
				if(clicked._id){
					window.location.assign(`/users/${clicked._id}`)
				}else{
					console.log(`Clicked special function ${clicked.special}`)
				}
			}}
			selectable={false}
			multi_select={false}
		/>
	</div>)
}

export default UserListView