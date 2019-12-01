import React from 'react'

function SubcatItem({parent, subcategory}){
    return(<li><a href={`/cat/${parent._id}/${subcategory._id}`}>{subcategory.name}</a></li>)
}

function DrillDownPane({category, all_categories}){
    
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

    return(
        <div className="drill-down-pane">
            <h1>{category.name}</h1>
            <h2>Please select a sub-category</h2>
            <ul>
                {subcat_items}
            </ul>
        </div>
    )
}

export default DrillDownPane