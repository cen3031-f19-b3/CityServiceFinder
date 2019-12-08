/* This component allows a user to create or edit categories. It is designed for display in the sidebar.
 * 
 * The key "category" determines whether a user is creating or updating a category - if it is a proper
 * category object, the component is set up to edit the provided category; if it is null, then the component
 * is set up to create a new category.
 */

import React, { useState, useEffect, useCallback } from 'react'

import { CreateCategory, UpdateCategory } from '../../util/Categories'

import SearchableList from '../SearchableList/SearchableList'

import './CategoryButton.css'

/* Sends new or updated information to the backend
 *
 * Calls in_progress_set(true) at the start of the operation, then calls
 * in_progress_set(false) at the end, before calling commit_callback().
 */
async function commit_changes(category, create_new, in_progress_set, commit_callback){
	in_progress_set(true)

	if(create_new){
		delete category["_id"]
		await CreateCategory(category)
	}else{
		await UpdateCategory(category)
	}
	
	in_progress_set(false)

	commit_callback()
}

/* Determines if a category has children - i.e. there is some other category
 * which has this category as a parent
 */
function get_children(potential_parent, all_categories){
	if(!potential_parent){
		return []
	}

	let children = []

	for(let cat of all_categories){
		for(let parent of cat.subcategory_of){
			if(parent._id === potential_parent._id){
				children.push(cat)
			}
		}
	}

	return children
}

/* This component displays three things, in a <tr>:
 * 
 * 1. The name of a property (e.g. name, icon, etc)
 * 2. A text-input field (with its ref sent to the `fref` callback)
 * 3. An "i" icon which, when hovered over, displays more information.
 */
function CEPEntry({name, initial_value, fref, placeholder, info_text}){
	return (
		<tr>
			<td>
				<h2>{name}</h2>
			</td>
			<td>
				<input type="text" defaultValue={initial_value} ref={fref} placeholder={placeholder} />
			</td>
			<td>
				<i className="fal fa-info-circle" title={info_text} />
			</td>
		</tr>
	)
}

/* This component displays the small rounded buttons which appear above the category selector to indicate which categories
 * are selected. on_click_callback() is called whenever the button is clicked.
 */
function CatButton({name, _id, on_click_callback}){
	return (
		<div className="cat-button" onClick={() => on_click_callback(_id)}><i className="fal fa-times-circle" /> {name}</div>
	)
}

/* Main component.
 * 
 * `category` is either the existing category object (if this pane should edit
 *            a category), or null (if the pane should create a new category).
 * 
 * `all_categories` is a list of all categories, used for the parent-category
 *                  selector.
 * 
 * `commit_callback` is called whenever a user clicks the "commit"/"add"
 *                   button, after the server has responded.
 */
function ManageCategoryPane({category, all_categories, commit_callback, side_pane_open_callback}) {
	// States

	// used to determine whether to disable the "commit"/"add" button
	const [commit_in_progress, set_commit_in_progress] = useState(false)

	// Holds an Input ref to the category name
	const [cat_name, set_cn] = useState(null)

	// Holds an Input ref to the category icon
	const [cat_img, set_img] = useState(null)

	// Holds the current list of selected parents for this category
	const [cat_parents, set_cat_parents] = useState(category ? category.subcategory_of : [])

	// If the category changes, the input values need to reset
	const category_changed = useCallback(() => {
		if(cat_name){
			cat_name.value = category.name
		}
		if(cat_img){
			cat_img.value = (category.img ? category.img : "")
		}
		if(cat_parents){
			set_cat_parents(category.subcategory_of)
		}
	}, [category, cat_name, cat_img, cat_parents])
	useEffect(category_changed, [category])

	// Disable the button if an operation is in progress
	let btn_class = "button"
	if(commit_in_progress) {btn_class += " button-disabled"}

	// If this category does NOT have children of its own, it can be made a
	// child of a different category. Subcategories of subcategories are not
	// supported, so categories with children cannot themselves become children
	let my_children = get_children(category, all_categories)
	let parent_category_list = null
	if(my_children.length > 0){
		parent_category_list = <div>
			<h2>Parent Categories (disabled)</h2>
			<p className="subtle-text">
				This category has children, so it cannot be made a child of any other categories. 
				To make this into a subcategory, remove it from the "Parent Categories" lists of 
				the following categories:
			</p>
			<ul>
				{my_children.map((child) => <li onClick={() => {
					side_pane_open_callback(<ManageCategoryPane 
						category={child}
						all_categories={all_categories}
						commit_callback={commit_callback}
						side_pane_open_callback={side_pane_open_callback}
					/>)
				}}>{child.name}</li>)}
			</ul>
		</div>
	}else{
		// Find all categories which can be added as parents to this one, and parse
		// them into items which can be placed into a <SearchableList/> (defined in
		// src/components/SearchableList/SearchableList.js)
		const list_items = all_categories.filter((cat) => {
			if(category && cat._id === category._id){
				return false // Exclude this category
			}
			if(cat.subcategory_of.length !== 0){
				return false // Subcategories of subcategories are not allowed.
			}
			let is_parent = false
			cat_parents.forEach((parent_cat) => {
				if(parent_cat._id === cat._id){
					is_parent = true
				}
			})
			return !is_parent
		}).map((cat) => {
			return {
				contents: <span>{cat.name}</span>,
				search_on: cat.name + cat._id,
				_id: cat._id
			}
		})

		// Turn all current parent categories into <CatButton /> objects (defined
		// in this file, above)
		const cat_buttons = cat_parents.map((cat) => {
			return <CatButton name={cat.name} _id={cat._id} on_click_callback={(_id) => {
				set_cat_parents(cat_parents.filter((pcat) => {return pcat._id !== _id}))
			}} />
		})

		parent_category_list = <div>
			<h2>Parent Categories <i className="fal fa-info-circle" title="If this should be a subcategory, what categories should it be a subcategory of?" /></h2>
			<div className="cat-button-deck d-flex flex-wrap">
				{cat_buttons}
			</div>
			<div style={{height: "15em", "marginBottom": "0.5em"}}>
				<SearchableList 
					objects={list_items}
					click_callback={(obj) => {
						all_categories.forEach((cat) => {
							if(cat._id === obj._id){
								set_cat_parents(cat_parents.concat(cat))
							}
						});
					}}
					selectable={false}
					multi_select={false}
				/>
			</div>
		</div>
	}

	// Parse these objects into the main pane
	return(
		<div className="category-edit-pane">
			<h1>{category ? category.name : "Create New Category"}</h1>
			{category ? <p className="subtle-text">Category ID: {category._id}</p> : null}
			<table>
				<tbody>
					<CEPEntry name="Name" initial_value={category ? category.name : ""} fref={set_cn} placeholder="Category Name" info_text="The display name for this category." />
					<CEPEntry name="Icon" initial_value={category ? category.img : ""} fref={set_img} placeholder="Category Icon" info_text="The icon to display for this category. Icon names can be found at fontawesome.com/icons." />
				</tbody>
			</table>
			{parent_category_list}
			<div className={btn_class} onClick={() => commit_changes(
				{_id: (category ? category._id : null), name: cat_name.value, img: cat_img.value, subcategory_of: cat_parents},
				category ? false : true,
				set_commit_in_progress,
				commit_callback
			)}><i className={category ? "fal fa-upload" : "fal fa-plus-circle"} /> {category ? " Commit Changes" : " Create New Category"}</div>
		</div>
	)
}

export default ManageCategoryPane