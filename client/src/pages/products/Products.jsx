import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteButton from '../../components/routebutton/RouteButton';
import './products.css';

const Products = () => {

  const [ products, setProducts ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ search, setSearch ] = useState("");
  const [ sortBy, setSortBy ] = useState("title");
  const [ sortOrder, setSortOrder ] = useState("asc");
  const [ brand, setBrand ] = useState("");
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ isPriceOpen, setIsPriceOpen ] = useState(false);
  const [ isBrandOpen, setIsBrandOpen ] = useState(false);

  const priceRef = useRef(null);
  const brandRef = useRef(null);

  //Traer la data
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [ account1Res, account2Res ] = await Promise.all([
          fetch('/data/items-account1.json'),
          fetch('/data/items-account2.json')
        ]);

        let allProducts = [];

        if (account1Res.ok) {
          const account1Data = await account1Res.json();
          allProducts = [...allProducts, ...account1Data];
        } else {
          console.warn ("No se pudo cargar cuenta 1");
        }

        if (account2Res.ok) {
          const account2Data = await account2Res.json();
          allProducts = [...allProducts, ...account2Data];
        } else {
          console.warn ("No se pudo cargar cuenta 2");
        }

        //Eliminar duplicados
        const uniqueProducts = Array.from(
          new Map(allProducts.map(item => [item.id, item])).values()
        );

        setProducts(uniqueProducts);

      } catch (err) {
        console.error('Error fetching products', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  //Formato Precio
  const formatPrice = (price) => {
    if (!price) return "0,00";

    const priceStr = price.toFixed(2);
    const [ integer, decimal ] = priceStr.split('.');

    return {
      integer: integer.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      decimal: decimal
    }
  };

  //Cerrar selects cuando hago click afuera
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

  const brands = [
    "", "Admiral", "Aoc", "Ashima", "Bgh", "Daewoo", "Goldstar", "Hisense", "Hitachi", "Hyundai", "Ilo", "Jvc", "Kanji", "Ken Brown", "Master-g", "Motorola", "Nex", "Noblex", "Panoramic", "Philco", "Philips", "Pioneer", "Quantic", "Rca", "Samsung", "Sansei", "Sanyo", "Sharp", "Skyworth", "Talent", "Tcl", "Tedge", "Telefunken", "Ths", "Tonomac", "Top House", "Toshiba"
  ]

  //Lógica buscador
  const filteredData = products
    .filter((product) => {
      const title = product.title.toLowerCase();
      const searchTerms = search.toLowerCase().trim().split(/\s+/);
      const allTerms = [...searchTerms, brand.toLowerCase()].filter(term => term);
      return allTerms.every(term => title.includes(term.replace(/\s+/g, "")) || title.includes(term));
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

    const productsPerPage = 20;
    const maxVisiblePages = window.innerWidth < 600 ? 3 : (window.innerWidth < 800 ? 4 : 8);
    const totalPages = Math.ceil(filteredData.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredData.slice(indexOfFirstProduct, indexOfLastProduct);

    const toggleSortOrder = () => {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      setCurrentPage(1);
    }

    const handleSortByChange = (e) => {
      setSortBy(e.target.value);
      setCurrentPage(1);
    }

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
  
  if (error) {
    return (
      <div className='products-container'>
        <div className='error'>{error}</div>
      </div>
    )
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
            <div className="sort-container">
              <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}
              className="sort-select"
              >
                <option value="price-asc">Ordenar por Precio 🠉</option>
                <option value="price-desc">Ordenar por Precio 🠋</option>
                <option value="title-asc">Ordenar Alfabéticamente 🠉</option>
                <option value="title-desc">Ordenar Alfabéticamente 🠋</option>
              </select>
            </div>

            <div classname={`select-container ${isBrandOpen ? "brand-open" : ""}`} ref={brandRef}>
              <select value={brand} onChange={(e) => { setBrand(e.target.value); setCurrentPage(1); }}>
                <option value="">Todas las Marcas</option>
                {brands.slice(1).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
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
                <p className="discounted-price">
                  ${formatPrice(product.price * 0.9).integer}
                  <span className='decimals'>{formatPrice(product.price * 0.9).decimal}</span>
                </p>
                <RouteButton text="Ver Producto" route={`/products/${product.id}`} />
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
            {window.innerWidth < 800 ? "Ant" : "Anterior"}
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
            {window.innerWidth < 800 ? "Sig" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>

  );
};

export default Products;