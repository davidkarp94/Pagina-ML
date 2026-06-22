import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css";
import logo from "../../../data/logonk.png";
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {

  const [ isOpen, setIsOpen ] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className='navbar-container'>

          <div className="logo">
            <Link to="/">
              <img src={logo} alt="NK Repuestos Marcos Paz" className='navbar-logo' />
            </Link>
          </div>

          {/* Hamburguer */}
          <button className='hamburger' onClick={toggleMenu}>
            {isOpen ? <FiX size={32} /> : <FiMenu size={32} />}
          </button>

          <div className={`navbar-links-container ${isOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsOpen(false)}>Inicio</Link>

            <Link to="/products" onClick={() => setIsOpen(false)}>Repuestos</Link>

            <Link to="/firmwares" onClick={() => setIsOpen(false)}>Firmwares</Link>

            <Link to="/guide" onClick={() => setIsOpen(false)}>Guía de Compra</Link>
          </div>

      </nav>
    </>
  )
}

export default Navbar