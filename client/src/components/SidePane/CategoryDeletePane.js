import React, { useState } from 'react';

async function confirm_delete(to_delete, in_progress_set, delete_result_callback, disabled){
    if(disabled){return}
    in_progress_set(true)
    console.log(`Deleting category ${to_delete.name}`)
    in_progress_set(false)

    delete_result_callback()
}

function CategoryDeletePane({category, delete_result_callback}) {
    const [del_btn_disabled, set_del_btn_disabled] = useState(true)
    const [in_text_ref, set_in_text_ref] = useState(null)

    let btn_class = "button danger-button"
    if(del_btn_disabled) {btn_class += " button-disabled"}

    return(
        <div className="category-delete-pane">
            <h1>DELETE CATEGORY</h1>
            <p className="err-toast err-toast-big">WARNING! This will irrevocably delete the category "{category.name}" from the system! This action CANNOT BE UNDONE!</p>
            <p>If you are absolutely sure you want to do this, type "DELETE {category.name}" in the box below.</p>

            <input type="text" placeholder={`Type DELETE ${category.name} to confirm...`} ref={set_in_text_ref} onChange={() => {
                if(in_text_ref.value === `DELETE ${category.name}`){
                    set_del_btn_disabled(false)
                }else{
                    set_del_btn_disabled(true)
                }
            }} />
            
            <div className={btn_class} onClick={() => confirm_delete(
                category,
                set_del_btn_disabled,
                delete_result_callback,
                del_btn_disabled
            )}><i className="fal fa-minus-circle" /> {`DELETE ${category.name}`}</div>
        </div>
    )
}

export default CategoryDeletePane