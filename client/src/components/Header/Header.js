import React, {useState} from 'react';
import './Header.css';
import LoginPane from '../LoginPane.js';

function Header() {

	const [display_login, set_display_login] = useState(false)

	return (
	<div className='container-fluid'>
	  	<div className="col-xl">
			<div className='topnav'>
				<table className="header-table">
					<tbody>
						<tr>
							<td><a className="header-button" id="logo-link" href="/"> <i className="fal fa-home fa-2x" /></a></td>
							<td>GNV Resource Directory</td>
							<td><div className="header-button" onClick={() => set_display_login(true)}><i className="fal fa-user fa-2x" /></div></td>
						</tr>
					</tbody>
				</table>
				<LoginPane is_displaying={display_login} close_callback={() => set_display_login(false)} />
			</div>
		</div>
	</div>

	)
}

export default Header;
