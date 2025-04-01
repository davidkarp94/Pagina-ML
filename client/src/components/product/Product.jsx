import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './product.css';
import { useCart } from '../../context/CartContext';

const data = [
  { id: 1, name: "Producto A", price: 5000, category: "Electrónica", description: "Descripción del Producto A" },
  { id: 2, name: "Producto B", price: 3000, category: "Hogar", description: "Descripción del Producto B" },
  { id: 3, name: "Producto C", price: 8000, category: "Electrónica", description: "Descripción del Producto C" },
  { id: 4, name: "Producto D", price: 2000, category: "Juguetes", description: "Descripción del Producto D" },
  { id: 5, name: "Producto E", price: 6000, category: "Hogar", description: "Descripción del Producto E" },
  { id: 6, name: "Producto F", price: 7000, category: "Electrónica", description: "Descripción del Producto F" },
  { id: 7, name: "Producto G", price: 4500, category: "Juguetes", description: "Descripción del Producto G" },
  { id: 8, name: "Producto H", price: 2500, category: "Hogar", description: "Descripción del Producto H" },
  { id: 9, name: "Producto I", price: 1000, category: "Juguetes", description: "Descripción del Producto I" },
  { id: 10, name: "Producto J", price: 9000, category: "Electrónica", description: "Descripción del Producto J" },
  { id: 11, name: "Producto K", price: 8500, category: "Hogar", description: "Descripción del Producto K" },
  { id: 12, name: "Producto L", price: 1200, category: "Juguetes", description: "Descripción del Producto L" },
  { id: 13, name: "Producto M", price: 5300, category: "Electrónica", description: "Descripción del Producto M" },
  { id: 14, name: "Producto N", price: 4700, category: "Hogar", description: "Descripción del Producto N" },
  { id: 15, name: "Producto O", price: 3200, category: "Juguetes", description: "Descripción del Producto O" },
];

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = data.find((p) => p.id === parseInt(id));

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  }

  if (!product) {
    return <div>Producto no encontrado</div>
  }

  return (
    <div className='product-container'>
      <p className="product-title">{product.name}</p>
      <img 
        src="https://i0.wp.com/ricedh.org/wp-content/uploads/2020/11/qi-bin-w4hbafegiac-unsplash.jpg?fit=1600%2C1066&ssl=1" 
        alt={`Imagen de ${product.name}`} 
        className="product-img"
      />
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Categoría:</strong> {product.category}</p>
      <p><strong>Descripción:</strong> {product.description}</p>
      <button
      className="buy-button"
      onClick={handleAddToCart}
      >
        Agregar al Carrito
      </button>
    </div>
  )
}

export default Product