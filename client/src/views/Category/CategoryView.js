import React, { useState } from 'react';
import { GetAllCategories } from '../../util/Categories'
import { CanUserDo } from '../../util/Auth'
import CategoryCreatePane from '../../components/SidePane/CategoryCreatePane'
import CategoryEditPane from '../../components/SidePane/CategoryEditPane'
import CategoryDeletePane from '../../components/SidePane/CategoryDeletePane'
import DrillDownPane from '../../components/SidePane/DrillDownPane'

import './CategoryView.css';

function is_parent(cat, all_cats){
	return all_cats.filter((potential_child) => {
		return potential_child.subcategory_of.includes(cat._id)
	}).length !== 0
}

function open_category(cat, all_cats, side_pane_open_callback, refresh_callback){
	if(is_parent(cat, all_cats)){
		side_pane_open_callback(
			<DrillDownPane 
				category={cat}
				all_categories={all_cats}
				side_pane_open_callback={side_pane_open_callback}
				refresh_callback={refresh_callback}
			/>
		)
	}else{
		window.location.assign(`/cat/${cat._id}`)
	}
}

function create_category(cat, all_cats, side_pane_open_callback, refresh_callback){
	side_pane_open_callback(
		<CategoryCreatePane
			commit_callback={() => {
				side_pane_open_callback(null)
				refresh_callback()
			}}
			all_categories={all_cats}
		/>
	)
}

function edit_category(cat, all_cats, side_pane_open_callback, refresh_callback){
	side_pane_open_callback(
		<CategoryEditPane 
			category={cat}
			all_categories={all_cats}
			commit_callback={() => {
				side_pane_open_callback(null)
				refresh_callback()
			}}
		/>
	)
}

function del_category(cat, side_pane_open_callback, refresh_callback){
	side_pane_open_callback(
		<CategoryDeletePane 
			category={cat}
			delete_result_callback={() => {
				side_pane_open_callback(null)
				refresh_callback()
			}}
		/>
	)
}

function ServiceButton({ text, img, data, this_category, callback, edit_callback, del_callback, side_pane_open_callback, refresh_callback, id }) {
	let img_txt = "fal fa-" + img + " fa-3x"
	let edit_btn = null
	if(CanUserDo("edit", `/cat/${id}`) && edit_callback){
		edit_btn = <i className={"service-button-edit fal fa-wrench"} title={`Edit ${text}`} onClick={() => edit_callback(this_category, data, side_pane_open_callback, refresh_callback)} />
	}
	let del_btn = null
	if(CanUserDo("delete", `/cat/${id}`) && del_callback){
		del_btn = <i className={"service-button-delete fal fa-minus-circle"} title={`Delete ${text}`} onClick={() => del_callback(this_category, side_pane_open_callback, refresh_callback)} />
	}
	const btn_deck = (edit_btn || del_btn) ? <p className="btn-deck">{edit_btn} {del_btn}</p> : null;
	return (
		<div className="service-button-wrapper">
			<div className="service-button" onClick={() => callback(this_category, data, side_pane_open_callback, refresh_callback)} title={text}>
				<div className="service-button-main">
					<p><i className={img_txt} /></p>
					<p>{text}</p>
				</div>
			</div>
			{btn_deck}
		</div>
	)
}

function CategoryView({side_pane_open_callback}) {
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
					data={data}
					this_category={category}
					callback={open_category}
					edit_callback={edit_category}
					del_callback={del_category}
					key={category._id}
					side_pane_open_callback={side_pane_open_callback}
					refresh_callback={() => set_load_done(false)}
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
				data={data}
				callback={create_category}
				edit_callback={null}
				del_callback={null}
				side_pane_open_callback={side_pane_open_callback}
				refresh_callback={() => set_load_done(false)}
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
