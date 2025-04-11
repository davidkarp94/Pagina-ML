import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteButton from '../../components/routebutton/RouteButton';
import './products.css';

const Products = () => {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const navigate = useNavigate();
  const priceRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/items-details.txt');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const data = JSON.parse(text);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(priceRef.current && !priceRef.current.contains(event.target)) {
        setIsPriceOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const productsPerPage = 20;
  const maxVisiblePages = 8;

  const filteredData = products
    .filter((product) =>{
      const title = product.title.toLowerCase();
      const searchTerms = search.toLowerCase().trim().split(/\s+/);
      return searchTerms.every(term => title.includes(term));
    })
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

    const totalPages = Math.ceil(filteredData.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredData.slice(indexOfFirstProduct, indexOfLastProduct);

    const getPageNumbers = () => {
      const pageNumbers = [];
      let startPage, endPage;

      if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
      } else {
        const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
        const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) -1;

        startPage = Math.max(currentPage - maxPagesBeforeCurrent, 1);
        endPage = Math.min(currentPage + maxPagesAfterCurrent, totalPages);

        if (endPage - startPage + 1 < maxVisiblePages) {
          if (startPage === 1) {
            endPage = Math.min(maxVisiblePages, totalPages);
          } else if (endPage === totalPages) {
            startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
          }
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return {
        pageNumbers,
        showLeftEllipsis: startPage > 1,
        showRightEllipsis: endPage < totalPages,
      };
    };

    const { pageNumbers, showLeftEllipsis, showRightEllipsis } = getPageNumbers();

  if (isLoading) {
    return (
      <div className="products-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className='products-container'>
      <div className="filters">
        <input 
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        />

        <div className="filters-selects">
          
          <div className={`select-container ${isPriceOpen ? "price-open" : ""}`} ref={priceRef}>
            <select 
            value={sortOrder}
            onClick={() => setIsPriceOpen((prev) => !prev)}
            onBlur={() => setTimeout(() => setIsPriceOpen(false), 200)}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
              setTimeout(() => setIsPriceOpen(false), 100);
            }}>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>

        </div>
      </div>

      <div className="results-count">
        Mostrando {filteredData.length.toLocaleString()} resultados
      </div>

      <div className="product-list">
        {currentProducts.map((product) => (
          <div 
          key={product.id} 
          className="product-card"
          >
            <p className="product-name">{product.title}</p>
            <img 
            src={product.thumbnail || "https://i0.wp.com/ricedh.org/wp-content/uploads/2020/11/qi-bin-w4hbafegiac-unsplash.jpg?fit=1600%2C1066&ssl=1"}
            alt={`Imagen de ${product.title}`} 
            className="product-image"
            />
            <p className="product-price">${product.price}</p>
            <p className="product-condition">Condición: {product.condition === "new" ? "Nuevo" : "Usado"}</p>
            <RouteButton text="Ver Producto" route={`/products/${product.id}`} />
          </div>
        ))};
      </div>

      <div className="pagination">
        <button
        className='pagination-button'
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        >
          Anterior
        </button>

        {showLeftEllipsis && <span className="pagination-ellipsis">...</span>}

        {pageNumbers.map((page) => (
          <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        {showRightEllipsis && <span className='pagination-ellipsis'>...</span>}

        <button
        className='pagination-button'
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

    </div>
  );
};

export default Products;