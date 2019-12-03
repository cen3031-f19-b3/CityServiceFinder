import React, { useState } from 'react';

import { CreateCategory } from '../../util/Categories'

import SearchableList from '../SearchableList/SearchableList'

import './CategoryButton.css'

async function commit_changes(new_category, in_progress_set, commit_callback){
    in_progress_set(true)
    await CreateCategory(new_category)
    in_progress_set(false)

    commit_callback()
}

/* A single text-entry field in the Create Category Pane table
 */
function CCPEntry({name, fref, placeholder, info_text}){
    return (
        <tr>
            <td>
                <h2>{name}</h2>
            </td>
            <td>
                <input type="text" ref={fref} placeholder={placeholder} />
            </td>
            <td>
                <i className="fal fa-info-circle" title={info_text} />
            </td>
        </tr>
    )
}

/* A div to hold parent-category information
 */
function CatButton({name, _id, on_click_callback}){
	return (
		<div className="cat-button" onClick={() => on_click_callback(_id)}><i className="fal fa-times-circle" /> {name}</div>
	)
}

/* A side-pane content element to allow an administrator to create a new category
 */
function CategoryCreatePane({commit_callback, all_categories, required_parent}) {
    const [commit_in_progress, set_commit_in_progress] = useState(false)
    const [cat_name, set_cn] = useState("")
    const [cat_img, set_img] = useState("")
    const [cat_parents, set_cat_parents] = useState(required_parent ? [required_parent] : [])

    let btn_class = "button"
    if(commit_in_progress) {btn_class += " button-disabled"}

	const list_items = all_categories.filter((cat) => {
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

	const cat_buttons = cat_parents.map((cat) => {
		return <CatButton name={cat.name} _id={cat._id} on_click_callback={(_id) => {
			set_cat_parents(cat_parents.filter((pcat) => {return pcat._id !== _id}))
		}} />
	})

    return(
        <div className="category-edit-pane">
            <h1>New Category</h1>
            <table>
                <tbody>
                    <CCPEntry name="Name" fref={set_cn} placeholder="Category Name" info_text="The display name for this category." />
                    <CCPEntry name="Icon" fref={set_img} placeholder="Category Icon" info_text="The icon to display for this category. Icon names can be found at fontawesome.com/icons." />
                </tbody>
            </table>
            <h2>Parent Categories <i className="fal fa-info-circle" title="If this should be a subcategory, what categories should it be a subcategory of?" /></h2>
			<div className="cat-button-deck d-flex flex-wrap">
				{cat_buttons}
			</div>
			<div style={{height: "15em", "margin-bottom": "0.5em"}}>
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
            <div className={btn_class} onClick={() => commit_changes(
                {name: cat_name.value, img: cat_img.value, subcategory_of: cat_parents},
                set_commit_in_progress,
                commit_callback
            )}><i className="fal fa-plus-circle" /> Create</div>
        </div>
    )
}

export default CategoryCreatePane