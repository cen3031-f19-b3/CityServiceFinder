import React, { useState } from 'react';
import { GetAllCategories } from '../../util/Categories'
import { CanUserDo } from '../../util/Auth'

import './CategoryView.css';

function edit_category(cat_id){
	console.log(`Edit ${cat_id}`)
}

function del_category(cat_id){
	console.log(`Delete ${cat_id}`)
}

function ServiceButton({ text, img, link, edit_callback, del_callback, id }) {
	let img_txt = "fal fa-" + img + " fa-3x"
	let edit_btn = null
	if(CanUserDo("edit", `/cat/${id}`) && edit_callback){
		//edit_btn = <div className="service-button-edit" onClick={() => edit_callback(id)}><i className={"fal fa-wrench"} title={`Edit ${text}`} /></div>
		edit_btn = <i className={"service-button-edit fal fa-wrench"} title={`Edit ${text}`} onClick={() => edit_callback(id)} />
	}
	let del_btn = null
	if(CanUserDo("delete", `/cat/${id}`) && del_callback){
		//del_btn = <div className="service-button-delete" onClick={() => del_callback(id)}><i className={"fal fa-minus-circle"} title={`Delete ${text}`} /></div>
		del_btn = <i className={"service-button-delete fal fa-minus-circle"} title={`Delete ${text}`} onClick={() => del_callback(id)} />
	}
	const btn_deck = (edit_btn || del_btn) ? <p className="btn-deck">{edit_btn} {del_btn}</p> : null;
	return (
		<div className="service-button-wrapper">
			<a className="service-button" href={link} title={text}>
				<div className="service-button-main">
					<p><i className={img_txt} /></p>
					<p>{text}</p>
				</div>
			</a>
			{btn_deck}
		</div>
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
					link={`./cat/${category._id}`}
					edit_callback={edit_category}
					del_callback={del_category}
					key={category._id}
					id={category._id}
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
				edit_callback={null}
				del_callback={null}
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
