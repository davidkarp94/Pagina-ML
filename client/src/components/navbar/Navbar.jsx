import React from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className='navbar-container'>
      <div className="logo">
        <Link to="/">
          NK Repuestos
        </Link>
      </div> 

      <div className="navbar-links-container">
        <Link to="/">Inicio</Link>

        <Link to="/products">Productos</Link>

        <Link to="about">Quienes Somos</Link>

        <Link to="/contact">Contacto</Link>
      </div>

      <div className="cart-container">
        <FaShoppingCart />
      </div>
    </div>
  )
}

export default Navbar