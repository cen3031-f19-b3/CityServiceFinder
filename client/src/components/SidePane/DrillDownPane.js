import React from 'react'

import CategoryCreatePane from './CategoryCreatePane'

import { CanUserDo } from '../../util/Auth'

function SubcatItem({parent, subcategory}){
    return(<a href={`/cat/${parent._id}/${subcategory._id}`}><li>{subcategory.name}</li></a>)
}

function DrillDownPane({category, all_categories, side_pane_open_callback}){
    
    const subcat_items = all_categories.filter((potential_subcategory) => {
        return potential_subcategory.subcategory_of.includes(category._id)
    }).map((subcat) => {
        return (
            <SubcatItem 
                key={subcat._id}
                parent={category}
                subcategory={subcat}
            />
        )
    })

    let create_button = null

    if(CanUserDo("create", `/cat/${category._id}`)){
        let required_parent = (CanUserDo("create", "/cat")) ? null : category._id
        create_button = <li onClick={() => {
            side_pane_open_callback(<CategoryCreatePane 
                commit_callback={() => {
                    side_pane_open_callback(null)
                }}
                required_parent={required_parent}
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