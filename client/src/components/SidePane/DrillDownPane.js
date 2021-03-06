import React from 'react'

import ManageCategoryPane from './ManageCategoryPane'
import CategoryDeletePane from './CategoryDeletePane'

function SubcatItem({parent, subcategory, all_cats, enable_edit, enable_delete, side_pane_open_callback, refresh_callback}){
	const edit_btn = enable_edit
		? <i className={"service-button-edit fal fa-wrench"} title={`Edit ${subcategory.name}`} onClick={() => {
			side_pane_open_callback(<ManageCategoryPane 
				category={subcategory}
				all_categories={all_cats}
				commit_callback={() => {
					refresh_callback()
					side_pane_open_callback(null)
				}}
				side_pane_open_callback={side_pane_open_callback}
			/>)
		}} />
		: null
	const del_btn = enable_delete
		? <i className={"service-button-delete fal fa-minus-circle"} title={`Delete ${subcategory.name}`} onClick={() => {
			side_pane_open_callback(<CategoryDeletePane 
				category={subcategory}
				delete_result_callback={() => {
					refresh_callback()
					side_pane_open_callback(null)
				}} />)
		}} />
		: null
	
	if(del_btn || edit_btn){
		return(
		<li>
			<table><tbody><tr>
				<td style={{width: "10%", whiteSpace: "nowrap"}}>{edit_btn}</td>
				<td style={{width: "10%", whiteSpace: "nowrap"}}> {del_btn} </td>
				<td style={{width: "auto"}} onClick={() => {window.location.assign(`/cat/${parent._id}/${subcategory._id}`)}}>{subcategory.name}</td>
			</tr></tbody></table>
		</li>
		)
	}else{
		return(
			<li onClick={() => {window.location.assign(`/cat/${parent._id}/${subcategory._id}`)}}>{subcategory.name}</li>
		)
	}
}

function DrillDownPane({category, all_categories, side_pane_open_callback, refresh_callback, check_auth}){
	
	const subcat_items = all_categories.filter((potential_child) => {
		let is_our_child = false
		potential_child.subcategory_of.forEach((pc_sc) => {
			if(pc_sc._id === category._id){
				is_our_child = true
			}
		})
		return is_our_child
	}).map((subcat) => {
		return (
			<SubcatItem 
				key={subcat._id}
				parent={category}
				subcategory={subcat}
				all_cats={all_categories}
				enable_edit={check_auth("edit", `/cat/${category._id}/${subcat._id}`)}
				enable_delete={check_auth("delete", `/cat/${category._id}/${subcat._id}`)}
				side_pane_open_callback={side_pane_open_callback}
				refresh_callback={refresh_callback}
			/>
		)
	})

	let create_button = null

	if(check_auth("create", `/cat/${category._id}`)){
		let required_parent = (check_auth("create", "/cat")) ? null : category._id
		create_button = <li onClick={() => {
			side_pane_open_callback(<ManageCategoryPane
				category={null}
				all_categories={all_categories}
				initial_parents={[category]}
				required_parent={required_parent}
				commit_callback={() => {
					side_pane_open_callback(null)
					refresh_callback()
				}}
				side_pane_open_callback={side_pane_open_callback}
			/>)
		}}>
			<span><i className="fal fa-plus-circle" /> Create New</span>
		</li>
	}

	return(
		<div className="drill-down-pane">
			<h1>{category.name}</h1>
			<h2>Please select a sub-category</h2>
			<ul>
				{subcat_items}
				{create_button}
			</ul>
		</div>
	)
}

export default DrillDownPane