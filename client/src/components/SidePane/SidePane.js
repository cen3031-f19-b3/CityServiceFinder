import React from 'react';
import './SidePane.css';

/* Displays a utility pane on the right side of the screen.
 * Used for various menus.
 * 
 * child_element is the component to display within the side pane,
 * close_callback is the callback which should be called when the
 *                close button is pressed.
 */
function SidePane({child_element, close_callback}){
    let side_pane_class = "side-pane"
    if(!child_element){
        side_pane_class += " side-pane-hidden"
    }

    return(
        <div className={side_pane_class}>
            <i onClick={() => close_callback(false)} className="panel-close fal fa-times fa-2x" />
            <div className="side-pane-content">
                {child_element}
            </div>
        </div>
    )
}

export default SidePane