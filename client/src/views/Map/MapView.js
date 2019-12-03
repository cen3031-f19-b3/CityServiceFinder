import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { GetCategoryServices } from '../../util/Services'
import './MapView.css'
import { GetSingleCategory } from '../../util/Categories';

const grab_services = async (cat_id) => {
	return await GetCategoryServices(cat_id)
}

const grab_own_category = async (cat_id) => {
	return await GetSingleCategory(cat_id)
}

function SingleServiceLi({service}){
	return <li className="service-list-item">
		<Link to={`/services/${service._id}`}>{service.name}{(service.addresses && service.addresses.length > 0) ? ` (${service.addresses[0].line_1})` : ""}</Link>
	</li>
}

function MapView({cat_id}){
	const [services, set_services] = useState(null)
	const [cat, set_cat] = useState(null)

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
		? <li className="service-list-loading">Loading...</li> 
		: ((services.length === 0) 
			? <h2>No services found.</h2> 
			: services.map((serv) => <SingleServiceLi key={serv._id} service={serv} />
		)
	)

	return(<div className="map-page">
		{category_name}
		<ul>
			{serv_list}
		</ul>
	</div>)
}

export default MapView
