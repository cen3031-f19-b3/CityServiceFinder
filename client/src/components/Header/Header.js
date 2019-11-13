import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import home from '../../assets/home-alt.png';


const Header = () => {
    return (
    <div className='container-fluid'>
      <div className="col-xl">
        <div className='topnav'>
            {/* Logo */}
            <Link id="logo-link" to="/">
                <img className="topnav-logo" src={ home } alt="Home" />
            </Link>
              <p className="top-name">myGNV Resource Finder</p>
        </div>
      </div>
    </div>

    )
}

export default Header;
