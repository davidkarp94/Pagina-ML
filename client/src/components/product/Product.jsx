import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './product.css';
import { useCart } from '../../context/CartContext';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [ product, setProduct ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ currentImageIndex, setCurrentImageIndex ] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/items-details.txt');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const data = JSON.parse(text);
        const foundProduct = data.find((p) => p.id === id);
        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (product.pictures.length - 1) : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.pictures.length - 1 ? 0 : prev + 1));
  }

  if (isLoading) {
    return <div className='product-container'>Cargando producto...</div>
  }

  if (!product) {
    return <div className='product-container'>Producto no encontrado.</div>
  }

  const images = product.pictures.length > 0
    ? product.pictures
    : ["https://i0.wp.com/ricedh.org/wp-content/uploads/2020/11/qi-bin-w4hbafegiac-unsplash.jpg?fit=1600%2C1066&ssl=1"];

  return (
    <div className='product-container'>
      <p className="product-title">{product.title}</p>

      <div className="carousel">
        <button
        className='carousel-button prev'
        onClick={handlePrevImage}
        disabled={images.length <= 1}
        >
          &#9664;
        </button>

        <img
        src={images[currentImageIndex]}
        alt={`Imagen ${currentImageIndex + 1} de ${product.title}`}
        className="product-img"
        />

        <button
        className='carousel-button next'
        onClick={handleNextImage}
        disabled={images.length <= 1}
        >
          &#9654;
        </button>
      </div>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
          key={index}
          className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
          onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>

      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Condición:</strong> {product.condition === "new" ? "Nuevo" : "Usado"}</p>
      <p><strong>Stock:</strong> {product.available_quantity} {product.available_quantity === 1 ? "Unidad" : "Unidades"}</p>
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