import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { FaWhatsapp } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { SlBookOpen } from "react-icons/sl";
import { IoAlertCircleOutline } from "react-icons/io5";
import { SiMercadopago } from "react-icons/si";
import './product.css';

const Product = () => {
  const { id } = useParams();
  const [ product, setProduct ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  //Formatear precio
  const formatPrice = (price) => {
    if (!price) return { integer: "0", decimal: "00" };

    const priceStr = price.toFixed(2);
    const [ integer, decimal ] = priceStr.split('.');

    return {
      integer: integer.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      decimal: decimal
    };
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [ account1Res, account2Res ] = await Promise.all([
          fetch('/data/items-account1.json'),
          fetch('/data/items-account2.json')
        ]);

        let allProducts = [];

        if (account1Res.ok) {
          const data1 = await account1Res.json();
          allProducts = [...allProducts, ...data1];
        }

        if (account2Res.ok) {
          const data2 = await account2Res.json();
          allProducts = [...allProducts, ...data2];
        }

        const foundProduct = allProducts.find(p => p.id === id);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Producto no encontrado.");
        }

      } catch (err) {
        console.error("Error cargando producto: ", err);
        setError("Error al cargar el producto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className='product-container'>
        <div className="loading">
          Cargando producto...
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='product-container'>
        <div className="error">
          Producto no encontrado.
        </div>
      </div>
    )
  }

  const fallbackImage = "https://i0.wp.com/ricedh.org/wp-content/uploads/2020/11/qi-bin-w4hbafegiac-unsplash.jpg?fit=1600%2C1066&ssl=1";

  const images = product.pictures && product.pictures.length > 0
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

    const whatsappNumber = "5491150943302";

    const messageHelp = encodeURIComponent(
      `Hola, tengo una consulta acerca del producto: "${product.title}"\n\n`
    );

    const messageBuy = encodeURIComponent(
      `Hola, me interesa comprar el siguiente producto: "${product.title}"\nLink: https://nkrepuestos.com/products/${product.id}\n`
    );

    const whatsappHelpLink = `https://wa.me/${whatsappNumber}?text=${messageHelp}`;

    const whatsappBuyLink = `https://wa.me/${whatsappNumber}?text=${messageBuy}`;

  return (
    <div className='product-container'>
      <p className="product-title">{product.title}</p>

      <ImageGallery 
        items={images}
        showNav={true}
        showThumbnails={true}
        thumbnailPosition="bottom"
        showFullscreenButton={true}
        showPlayButton={false}
        autoPlay={false}
        slideDuration={0}
        disableThumbnailScroll={true}
        additionalClass="product-image-gallery"
        useBrowserFullscreen={true}
        infinite={true}
      />

      <div className="product-conditions">
        <p className='product-text'><strong>Stock:</strong> {product.available_quantity} {product.available_quantity === 1 ? "Unidad" : "Unidades"}</p>
        <p>|</p>
        <p className='product-text'><strong>Condición:</strong> {product.condition === "new" ? "Nuevo" : "Usado"}</p>
      </div>

      <div className='price-section'>
        <div className="price-title">
          <p className='highlighted'>MEJOR PRECIO</p>
          <p>Comprando en nuestra Tienda Online</p>
        </div>

        <div className="prices-container">
          <div className="original-price-container">
            <div className="original-price-text">
              <p>Precio en otras plataformas</p>
              <IoAlertCircleOutline />
            </div>
            <p className="original-price">
              ${formatPrice(product.price).integer}
              <span className='decimals'>{formatPrice(product.price).decimal}</span>
            </p>
          </div>
          <div className="discounted-price-container">
            <p className="discounted-price-save">
              {`AHORRÁS $${formatPrice(product.price * 0.1).integer},${formatPrice(product.price * 0.1).decimal}`}
            </p>
            <p className="product-discounted-price">
              ${formatPrice(product.price * 0.9).integer}
              <span className='decimals'>{formatPrice(product.price * 0.9).decimal}</span>
            </p>
            <div className="discounted-price-mp">
              <SiMercadopago />
              <p>Transferencia o MercadoPago</p>
            </div>
          </div>
        </div>
      </div>

    {/* Sección consultas y compras */}
      <div className="action-buttons">
        <button className='btn guide-btn'>
          <SlBookOpen />
          <div className="guide-text">
            <strong>Como realizo la compra?</strong>
            <p>Guía paso a paso.</p>
          </div>
        </button>
        <div className="buy-section">
          <a href={whatsappBuyLink} target="_blank" rel="noopener noreferrer" className="btn buy-btn">
            <div className="buy-icons">
              <FaWhatsapp />
              <IoCartOutline />
            </div>
            <div className="buy-text">
              <strong>Continuar con la Compra</strong>
              <p>Realizá tu pedido y coordinamos el pago.</p>
            </div>
          </a>
        </div>
      </div>

      <div className="consulta-section">
        <div className='consulta-divider'>
          Tenés alguna consulta?
        </div>
        <div>
          <a href={whatsappHelpLink} target="_blank" rel="noopener noreferrer" className='btn help-btn'>
            <FaWhatsapp />
            <p>Consultanos por Whatsapp</p>
          </a>
        </div>
      </div>

    {/* Sección descripción */}

      <div className="product-description">
        <p className="bold">Especialistas en Repuestos y Firmwares para TV</p>

        <p>Contamos con años de experiencia en reparación electrónica y comercialización de repuestos para televisores de las principales marcas del mercado.</p>

        <p>Trabajamos con placas, fuentes, tiras LED, T-CON, botoneras, sensores, cables, accesorios y firmwares para una amplia variedad de modelos.</p>

        <p className="bold">Calidad y Verificación</p>

        <p>Todos nuestros productos son revisados y verificados antes de su publicación. En el caso de placas y componentes electrónicos, realizamos pruebas de funcionamiento para garantizar que se encuentren en correctas condiciones antes del envío.</p>

        <p>Las fotografías publicadas corresponden al producto ofrecido, y cualquier detalle relevante será detallado en las mismas.</p>

        <p className="bold">Soporte Técnico</p>

        <p>Sabemos que encontrar el repuesto correcto puede ser complicado. Por eso ofrecemos asesoramiento técnico previo a la compra para ayudarte a identificar la pieza compatible con tu equipo.</p>

        <p>Si tienes dudas sobre compatibilidad, modelo o número de parte, puedes consultarnos antes de realizar tu pedido.</p>

        <p className="bold">Firmwares para TV</p>

        <p>Disponemos de una amplia colección de firmwares para televisores LED, LCD y Smart TV.</p>

        <p>Nuestro equipo puede ayudarte a identificar el archivo adecuado según el modelo y versión de tu equipo, reduciendo riesgos y evitando instalaciones incorrectas.</p>

        <p className="bold">Envíos a Todo el País</p>

        <p>Realizamos envíos a todo el país mediante servicios de correo y transporte confiables.</p>

        <p>Todos los productos son embalados cuidadosamente para garantizar que lleguen en perfectas condiciones.</p>
        
        <p className="bold">Pedidos Especiales</p>

        <p>¿No encuentras el repuesto que buscas?</p>

        <p>Podemos ayudarte a localizar componentes específicos o gestionar pedidos especiales según disponibilidad de nuestros proveedores.</p>

        <p className="bold">Atención Personalizada</p>

        <p>Nuestro compromiso es brindar una atención rápida, profesional y orientada a resolver las necesidades de cada cliente.</p>

        <p>Antes, durante y después de la compra estaremos disponibles para responder consultas y brindar asistencia técnica cuando sea necesario.</p>

        <p className="bold">Importante</p>

        <p>Antes de realizar tu compra, verifica que el código de la pieza coincida exactamente con el de tu equipo. En componentes electrónicos, la compatibilidad se determina principalmente por el número de parte impreso en la placa y no únicamente por el modelo del televisor.</p>

        <p>Si tienes alguna duda, contáctanos y te ayudaremos a identificar el repuesto correcto.</p>

        <p className="bold">Medios de pago</p>

        <p>Aceptamos transferencia bancaria o por MercadoPago. Si tienes alguna consulta, estaremos encantados de ayudarte.</p>

      </div>

    </div>
  )
}

export default Product