import React from 'react'
import { COLOURS } from '../../utils/Contants';

const Header = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: COLOURS.darkBlue}}>
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src='../../pipe-data-visualization-dashboard/assets/logo.png' alt="Logo" className="d-inline-block align-top" />
          </a>
        </div>
      </nav>
    );
  }
  
  export default Header;
