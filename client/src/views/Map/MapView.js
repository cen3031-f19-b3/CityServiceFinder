import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { GetCategoryServices } from '../../util/Services'
import { GetSingleCategory } from '../../util/Categories'
import SearchableList from '../../components/SearchableList/SearchableList'

import './MapView.css'

const grab_services = async (cat_id) => {
	return await GetCategoryServices(cat_id)
}

const grab_own_category = async (cat_id) => {
	return await GetSingleCategory(cat_id)
}

function MapView({cat_id}){
	const [services, set_services] = useState(null)
	const [cat, set_cat] = useState(null)

	const [page_redir, do_redirect] = useState(null)

	useEffect(() => {
		grab_services(cat_id)
			.then(set_services)
			.catch((e) => console.error(e))
		
		grab_own_category(cat_id)
			.then(set_cat)
			.catch((e) => console.error(e))
	}, [cat_id])
	
	const category_name = (cat === null) ? <h1>Loading...</h1> : <h1>{cat.name}</h1>

	const serv_list = (services === null) 
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

	return(<div className="map-page">
		{page_redir}
		{<p className="subtle-text"><Link to="/cat">All Categories ></Link></p>}
		{category_name}
		{(services) ? <h2>The following services are available in this category:</h2> : null}
		{(services) 
			? <SearchableList 
				objects={serv_list}
				click_callback={(obj) => {
					do_redirect(<Redirect path to={`/services/${obj._id}`} />)
				}}
				selectable={false}
				multi_select={false}
			/>
			: serv_list
		}
	</div>)
}

export default MapView
