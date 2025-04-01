import React from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from '../../context/CartContext';
import CartSidebar from '../cartsidebar/CartSidebar';

const Navbar = () => {

  const { toggleCart, cartItems } = useCart();

  return (
    <>
      <div className='navbar-container'>
        <div className="logo">
          <Link to="/">
            NK Repuestos
          </Link>
        </div> 

        <div className="navbar-links-container">
          <Link to="/">Inicio</Link>

          <Link to="/products">Productos</Link>

          <Link to="/about">Quienes Somos</Link>

          <Link to="/contact">Contacto</Link>
        </div>

        <div className="cart-container" onClick={toggleCart}>
          <FaShoppingCart />
          {cartItems.length > 0 && <span className='cart-count'>{cartItems.length}</span>}
        </div>
      </div>

      <CartSidebar />
    </>
  )
}

export default Navbar