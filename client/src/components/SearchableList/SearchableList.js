import React, { useState } from 'react'

import './SearchableList.css'

function SearchableListItem({object, click_callback, selected}){
	return <li
		className={selected ? "searchable-li searchable-li-selected" : "searchable-li"}
		onClick={() => click_callback(object)}
	>{object.contents}</li>
}

function SearchableList({objects, click_callback, selectable, multi_select, initial_selected}){
	if(!initial_selected){initial_selected = []}
	const [selected, set_selected] = useState(initial_selected)
	const [filter_ref, set_filter_ref] = useState(null)
	const [filter, set_filter] = useState("")
	const toggle_selected = (object) => {
		if(selectable){
			 if(!multi_select){
				set_selected(object)
			}else if(selected.includes(object)){
				const new_selected = selected.filter((obj) => {return obj !== object})
				set_selected(new_selected)
			}else{
				const new_selected = selected + object
				set_selected(new_selected)
			}
		}
	}

	let item_counter = 0;

	const list_items = objects.filter((obj) => {
		return obj && (!obj.search_on || obj.search_on.toLowerCase().includes(filter))
	}).map((obj) => {
		item_counter += 1
		return <SearchableListItem
			key={item_counter}
			object={obj}
			selected={selectable && selected.includes(obj)}
			click_callback={(clicked) => {
				toggle_selected(obj)
				click_callback(obj, selected)
			}}
		/>
	})

	const list_input = <input
		ref={set_filter_ref}
		onChange={() => {set_filter(filter_ref.value)}}
		placeholder="Search..."
	/>

	return(
		<div className="searchable-list">
			{list_input}
			<ul>
				{list_items}
			</ul>
		</div>
	)
}

export default SearchableList