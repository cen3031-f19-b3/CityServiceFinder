import React, { useState } from 'react';

async function commit_changes(new_category, in_progress_set, commit_callback){
    in_progress_set(true)
    console.log(`Creating ${new_category.name}`)
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

/* A side-pane content element to allow an administrator to create a new category
 */
function CategoryCreatePane({commit_callback, required_parent}) {
    const [commit_in_progress, set_commit_in_progress] = useState(false)
    const [cat_name, set_cn] = useState("")
    const [cat_img, set_img] = useState("")

    let btn_class = "button"
    if(commit_in_progress) {btn_class += " button-disabled"}

    return(
        <div className="category-edit-pane">
            <h1>New Category</h1>
            <table>
                <tbody>
                    <CCPEntry name="Name" fref={set_cn} placeholder="Category Name" info_text="The display name for this category." />
                    <CCPEntry name="Icon" fref={set_img} placeholder="Category Icon" info_text="The icon to display for this category. Icon names can be found at fontawesome.com/icons." />
                </tbody>
            </table>
            <div className={btn_class} onClick={() => commit_changes(
                {name: cat_name.value, img: cat_img.value},
                set_commit_in_progress,
                commit_callback
            )}><i className="fal fa-plus-circle" /> Create</div>
        </div>
    )
}

export default CategoryCreatePane