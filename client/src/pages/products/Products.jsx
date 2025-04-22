import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteButton from '../../components/routebutton/RouteButton';
import './products.css';

const Products = () => {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [ brand, setBrand ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [ isBrandOpen, setIsBrandOpen ] = useState(false);

  const navigate = useNavigate();
  const priceRef = useRef(null);
  const brandRef = useRef(null);

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
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setIsPriceOpen(false)
      }
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setIsBrandOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const productsPerPage = 20;
  const maxVisiblePages = 8;

  const brands = [
    "", "Admiral", "Aoc", "Ashima", "Bgh", "Daewoo", "Goldstar", "Hisense", "Hitachi", "Hyundai", "Ilo", "Jvc", "Kanji", "Ken Brown", "Master-g", "Motorola", "Nex", "Noblex", "Panoramic", "Philco", "Philips", "Pioneer", "Quantic", "Rca", "Samsung", "Sansei", "Sanyo", "Sharp", "Skyworth", "Talent", "Tcl", "Tedge", "Telefunken", "Ths", "Tonomac", "Top House", "Toshiba"
  ]

  const filteredData = products
    .filter((product) => {
      const title = product.title.toLowerCase();
      const searchTerms = search.toLowerCase().trim().split(/\s+/);
      const allTerms = [...searchTerms, brand.toLowerCase()].filter(term => term)
      return allTerms.every(term => {
        if (term.includes(" ")) {
          const concatenatedTerm = term.replace(/\s+/g, "");
          return title.includes(term) || title.includes(concatenatedTerm);
        }
        return title.includes(term);
      });
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
        const maxPagesBeforeCurrent = Math.floor((maxVisiblePages - 2) / 2);
        const maxPagesAfterCurrent = Math.ceil((maxVisiblePages - 2) / 2);

        startPage = Math.max(currentPage - maxPagesBeforeCurrent, 2);
        endPage = Math.min(currentPage + maxPagesAfterCurrent, totalPages - 1 );

        if (endPage - startPage + 1 < maxVisiblePages - 2) {
          if (startPage <= 2) {
            startPage = 2;
            endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
          } else if (endPage >= totalPages - 1) {
            startPage = Math.max(totalPages - maxVisiblePages + 2, 2);
            endPage = totalPages - 1;
          }
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return {
        pageNumbers,
        showLeftEllipsis: startPage > 2,
        showRightEllipsis: endPage < totalPages - 1,
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
      <div className="products-box">
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

          <div className={`select-container ${isBrandOpen ? "brand-open" : ""}`} ref={brandRef}>
            <select
            value={brand}
            onClick={() => setIsBrandOpen((prev) => !prev)}
            onBlur={() => setTimeout(() => setIsBrandOpen(false), 200)}
            onChange={(e) => {
              setBrand(e.target.value);
              setCurrentPage(1);
              setTimeout(() => setIsBrandOpen(false), 100);
            }}
          >
            <option value="">Todas las Marcas</option>
            {brands.slice(1).map((brandOption) => (
              <option key={brandOption} value={brandOption}>
                {brandOption.charAt(0).toUpperCase() + brandOption.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
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
          Mostrando {filteredData.length.toLocaleString()} resultados.
        </div>
        <div className="product-list">
          {currentProducts.map((product) => (
            <div
            key={product.id}
            className="product-card"
            >
              <p className="product-name">{product.title}</p>
              <div className="card-section">
                <img
                src={product.thumbnail || "https://i0.wp.com/ricedh.org/wp-content/uploads/2020/11/qi-bin-w4hbafegiac-unsplash.jpg?fit=1600%2C1066&ssl=1"}
                alt={`Imagen de ${product.title}`}
                className="product-image"
                />
                <p className="product-price">${product.price}</p>
                <RouteButton text="Ver Producto" route={`/products/${product.id}`} />
                <p className="product-condition">Condición: {product.condition === "new" ? "Nuevo" : "Usado"}</p>
              </div>
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
          {showLeftEllipsis && (
            <>
              <button
              className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <span className="pagination-ellipsis">...</span>
            </>
          )}
          {pageNumbers.map((page) => (
            <button
            key={page}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          {showRightEllipsis && (
            <>
              <span className='pagination-ellipsis'>...</span>
              <button
                className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
          <button
          className='pagination-button'
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>

    </div>
  );
};

export default Products;