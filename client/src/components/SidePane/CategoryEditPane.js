import React, { useState } from 'react';

async function commit_changes(new_category, in_progress_set, commit_callback){
    in_progress_set(true)
    console.log(`Commit changes to ${new_category.name}`)
    in_progress_set(false)

    commit_callback()
}

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

function CategoryEditPane({category, commit_callback}) {
    const [commit_in_progress, set_commit_in_progress] = useState(false)
    const [cat_name, set_cn] = useState(category.name)
    const [cat_img, set_img] = useState(category.img)

    let btn_class = "button"
    if(commit_in_progress) {btn_class += " button-disabled"}

    return(
        <div className="category-edit-pane">
            <h1>{category.name}</h1>
            <p className="subtle-text">Category ID: {category._id}</p>
            <table>
                <tbody>
                    <CEPEntry name="Name" initial_value={category.name} fref={set_cn} placeholder="Category Name" info_text="The display name for this category." />
                    <CEPEntry name="Icon" initial_value={category.img} fref={set_img} placeholder="Category Icon" info_text="The icon to display for this category. Icon names can be found at fontawesome.com/icons." />
                </tbody>
            </table>
            <div className={btn_class} onClick={() => commit_changes(
                {name: cat_name.value, img: cat_img.value},
                set_commit_in_progress,
                commit_callback
            )}><i className="fal fa-upload" /> Commit Changes</div>
        </div>
    )
}

export default CategoryEditPane