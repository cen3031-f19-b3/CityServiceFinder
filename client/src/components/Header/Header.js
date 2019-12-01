import React from 'react';
import './Header.css';

function Header({login_clicked_callback}) {

	return (
	<div className='container-fluid'>
	  	<div className="col-xl">
			<div className='topnav'>
				<table className="header-table">
					<tbody>
						<tr>
							<td><a className="header-button" id="logo-link" href="/"> <i className="fal fa-home fa-2x" /></a></td>
							<td>GNV Resource Directory</td>
							<td><div className="header-button" onClick={login_clicked_callback}><i className="fal fa-user fa-2x" /></div></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	)
}

export default Header;
