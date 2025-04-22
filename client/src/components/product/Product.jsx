import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './product.css';
import { useCart } from '../../context/CartContext';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [ product, setProduct ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);

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

  if (isLoading) {
    return <div className='product-container'>Cargando producto...</div>
  }

  if (!product) {
    return <div className='product-container'>Producto no encontrado.</div>
  }

  const fallbackImage = "https://i0.wp.com/ricedh.org/wp-content/uploads/2020/11/qi-bin-w4hbafegiac-unsplash.jpg?fit=1600%2C1066&ssl=1";

  const images = product.pictures.length > 0
    ? product.pictures.map((pic) => ({
      original: pic,
      thumbnail: pic,
      originalAlt: `Imagen de ${product.title}`,
      thumbnailAlt: `Miniatura de ${product.title}`
    }))
    : [{
      original: fallbackImage,
      thumbnail: fallbackImage,
      originalAlt: `Imagen de ${product.title}`,
      thumbnailAlt: `Miniatura de ${product.title}`
    }];

  return (
    <div className='product-container'>
      <p className="product-title">{product.title}</p>

      <ImageGallery 
        items={images}
        showNav={true}
        showThumbnails={true}
        thumbnailPosition="left"
        showFullscreenButton={true}
        showPlayButton={false}
        autoPlay={false}
        slideDuration={450}
        additionalClass="product-image-gallery"
      />

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