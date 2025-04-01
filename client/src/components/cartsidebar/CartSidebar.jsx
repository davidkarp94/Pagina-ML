import React from 'react';
import { useCart } from '../../context/CartContext';
import './cartsidebar.css';

const CartSidebar = () => {

    const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, isCartOpen, toggleCart } = useCart();

  return (
    <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
            <h2>🛒 Carrito</h2>
            <button className="close-btn" onClick={toggleCart}>✖</button>
        </div>

        {cartItems.length === 0 ? (
            <p className="empty-cart">El carrito está vacío</p>
        ) : (
            <>
                <ul className="cart-items">
                    {cartItems.map((item) => (
                        <li key={item.id} className="cart-item">
                            <div className="item-info">
                                <p>{item.name}</p>
                                <p>${item.price * item.quantity}</p>
                            </div>
                            <div className="item-controls">
                                <button className='control-btn' onClick={() => decreaseQuantity(item.id)}>-</button>
                                <span>{item.quantity}</span>
                                <button className='control-btn' onClick={() => increaseQuantity(item.id)}>+</button>
                                <button className='remove-btn' onClick={() => removeFromCart(item.id)}>🗑</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className='clear-cart' onClick={clearCart}>Vaciar Carrito</button>
                <button className='checkout-btn'>Avanzar al Pago</button>
            </>
        )}

    </div>
  )
}

export default CartSidebar