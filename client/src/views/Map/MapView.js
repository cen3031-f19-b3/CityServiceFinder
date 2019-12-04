import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { GetCategoryServices } from '../../util/Services'
import { GetSingleCategory, GetAllCategories } from '../../util/Categories'
import SearchableList from '../../components/SearchableList/SearchableList'
import ManageServicePane from '../../components/SidePane/ManageServicePane'

import './MapView.css'

const grab_services = async (cat_id) => {
	return await GetCategoryServices(cat_id)
}

const grab_one_category = async (cat_id) => {
	return await GetSingleCategory(cat_id)
}

const grab_all_categories = async () => {
	return await GetAllCategories()
}

function MapView({cat_id, parent_id, side_pane_open_callback, check_auth}){
	const [services, set_services] = useState(null)
	const [cat, set_cat] = useState(null)
	const [all_cats, set_all_cats] = useState(null)
	const [parent, set_parent] = useState(null)

	const [page_redir, do_redirect] = useState(null)

	useEffect(() => {
		grab_services(cat_id)
			.then(set_services)
			.catch((e) => console.error(e))
		
		grab_one_category(cat_id)
			.then(set_cat)
			.catch((e) => console.error(e))
		if(parent_id){
			grab_one_category(parent_id)
				.then(set_parent)
				.catch((e) => console.error(e))
		}

		grab_all_categories()
			.then(set_all_cats)
			.catch((e) => console.error(e))
	}, [cat_id, parent_id])
	
	const category_name = (cat === null) ? <h1>Loading...</h1> : <h1>{cat.name}</h1>

	let serv_list = (services === null) 
		? <h2>Loading...</h2> 
		: ((services.length === 0) 
			? <h2>No services found.</h2> 
			: services.map((serv) => {
				return {
					contents: serv.name,
					search_on: serv.name + serv._id,
					_id: serv._id
				}
			}
		)
	)

	const can_create = check_auth("create", "/services")

	if(can_create){
		const create_btn = {
			contents: <span><i className="fal fa-plus-circle" /> Create New Service</span>,
			search_on: "create new service",
			_id: null,
			special: "create"
		}
		if(services.length === 0){
			serv_list = [create_btn]
		}else{
			serv_list.push(create_btn)
		}
	}

	const top_nav = <p className="subtle-text">
		<Link to="/cat">All Categories ></Link> {
			(parent) 
			? <Link to={"/cat"}>{parent.name}</Link> 
			: null
		}
	</p>

	return(<div className="map-page">
		{page_redir}
		{top_nav}
		{category_name}
		{(services && services.length !== 0) ? <h2>The following services are available in this category:</h2> : null}
		{(can_create || (services && services.length !== 0)) 
			? <SearchableList 
				objects={serv_list}
				click_callback={(obj) => {
					if(obj._id){
						do_redirect(<Redirect path to={`/service/${obj._id}`} />)
					}else{
						if(obj.special === "create"){
							side_pane_open_callback(<ManageServicePane
								commit_callback={() => side_pane_open_callback(null)}
								this_service={null}
								all_categories={all_cats}
							/>)
							
						}
					}
				}}
				selectable={false}
				multi_select={false}
			/>
			: serv_list
		}
	</div>)
}

export default MapView
