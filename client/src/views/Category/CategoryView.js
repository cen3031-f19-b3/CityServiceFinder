import React, { useState } from 'react';
import { GetAllCategories } from '../../util/Categories'
import { CanUserDo } from '../../util/Auth'

import './CategoryView.css';

function ServiceButton({ text, img, link }) {
	var img_txt = "fal fa-" + img + " fa-3x"
	return (
		<a className="service-button" href={link}>
			<div className="service-button-main">
				<p><i className={img_txt} /></p>
				<p>{text}</p>
			</div>
		</a>
	)
}

function CategoryView() {
	const [data, set_data] = useState([])
	const [load_done, set_load_done] = useState(false)

	if (!load_done) {
		// If we don't have the categories yet, then grab them from the backend
		GetAllCategories()
			.then((categories) => {
				set_data(categories)
				set_load_done(true)
			})
			.catch((e) => console.error(e))

		// Use a placeholder page temporarily
		return (
			<div className="cat-page">
				<main>
					<h1>Loading...</h1>
				</main>
			</div>
		)
	}

	// Parse all categories into buttons
	const categories_list = data
		.filter(category => {
			return category["subcategory_of"].length === 0
		})
		.map(category => {
			return (
				<ServiceButton
					text={category.name}
					img={category.img}
					link={"./cat/" + category._id}
					key={category._id}
				/>
			)
		})
	
	// If the user has permissions to create a category, then add a button for that
	var edit_button = null
	if(CanUserDo("create", "/cat")){
		edit_button = 
			<ServiceButton
				text={"Create"}
				img={"plus-circle"}
				link={"./cat/new"}
			/>
	}

	return (
		
		<div className="cat-page">
			<main>
				<div className="intro-text d-flex flex-wrap">
					<div className="header-image">
						<i className="heart fal fa-hand-holding-heart fa-7x" />
					</div>
					<div className="body-text">
						<p>Life can get tough sometimes. We get it. We're here to help. Find free resources here.</p>
					</div>
				</div>
				<div className="d-flex flex-wrap">
					{categories_list}
					{edit_button}
				</div>
			</main>
		</div>
	)
}

export default CategoryView;
