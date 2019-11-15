import React from 'react';
import './Header.css';


const Header = () => {
    return (
    <div className='container-fluid'>
      <div class="col-xl">
        <div className='topnav'>
					<p className="top-name">
						<a id="logo-link" href="/"> <i className="fal fa-home fa-3x" /> </a>
						<span>myGNV Resource Finder</span>
					</p>
        </div>
      </div>
    </div>

    )
}

export default Header;
