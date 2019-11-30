import React from 'react';
import {Link} from 'react-router-dom';
import {GetAllServices} from '../util/Services'
import './MapPage.css'

function ServiceList({data, cat, loading_done}) {
	if(!loading_done){
		return(
			<ul className="service-list service-list-loading">
				<li>Loading...</li>
			</ul>
		)
	}

	if(data.length === 0){
		return(
			<ul className="service-list service-list-not-found">
				<li>No services found for this category!</li>
			</ul>
		)
	}

	const services_list = data
	.map((service, index) => {
		return(
			<li key={index} >
				<Link className="link-to-service-page" to={`/service/${service.name}`}>
					{service.name}
				</Link>
			</li>
		)
	})

	return(
		<ul className="service-list">
			{services_list}
		</ul>
	)
}

class MapPage extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			services: [],
			loading_done: false
		}

		GetAllServices()
			.then((services) => this.data_load_complete(services))
			.catch((e) => console.error(e))
	}

	data_load_complete(services){
		this.setState({
			services: services,
			loading_done: true
		})
	}

	render(){
		return(
			<div className="map-page">
				<main>
					<p>This is the map view for the category {this.props.cat}.</p>
					<ServiceList
						data={this.state.services}
						cat={this.props.cat}
						loading_done={this.state.loading_done}
					/>
				</main>
			</div>
		)
	}
}

export default MapPage
