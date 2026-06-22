import React, { useState, useEffect, useRef } from 'react';
import RouteButton from '../../components/routebutton/RouteButton';
import './firmwares.css';
import firmwareImage from '../../../data/fw.png';

const Firmwares = () => {

  const [ firmwares, setFirmwares ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ search, setSearch ] = useState("");
  const [ sortBy, setSortBy ] = useState("title");
  const [ sortOrder, setSortOrder ] = useState("asc");
  const [ brand, setBrand ] = useState("");
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ isBrandOpen, setIsBrandOpen ] = useState(false);

  const brandRef = useRef(null);

  //Cargar Firmwares
  useEffect(() => {
    const fetchFirmwares = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/firmwares.txt');

        if (!response.ok) throw new Error('No se pudieron cargar los Firmwares.')

        const data = await response.json();

        setFirmwares(data);
      } catch (err) {
        console.error('Error cargando Firmwares.', err);
        setError('No se pudieron cargar los Firmwares.')
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirmwares();
  }, []);

  //Cerrar selects cuando hago click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
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
  const filteredData = firmwares
    .filter((fw) => {

      const searchTerm = search.toLowerCase().trim().split(/\s+/);
      const brandMatch = !brand || fw.brand === brand;

      if (!searchTerm) return brandMatch;

      return brandMatch && (
        fw.brand.toLowerCase().includes(searchTerm) ||
        fw.model.toLowerCase().includes(searchTerm) ||
        fw.version.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      let compareA, compareB;

      if (sortBy === "brand") {
        compareA = a.brand;
        compareB = b.brand;
      } else {
        compareA = a.model;
        compareB = b.model;
      }

      if (sortOrder === "asc") {
        return compareA.localeCompare(compareB);
      } else {
        return compareB.localeCompare(compareA);
      }
    });

    const productsPerPage = 20;
    const maxVisiblePages = window.innerWidth < 600 ? 3 : (window.innerWidth < 800 ? 4 : 8);
    const totalPages = Math.ceil(filteredData.length / productsPerPage);
    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentFirmwares = filteredData.slice(indexOfFirst, indexOfLast);

    const handleSortByChange = (e) => {
      const [ newSortBy, newSortOrder ] = e.target.value.split('-');

      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setCurrentPage(1);
    };

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
        <div className="loading">Cargando firmwares...</div>
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
          placeholder="Buscar Firmware..."
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
              onChange={handleSortByChange}
              className="sort-select"
              >
                <option value="brand-asc">Ordenar por Marca ↑</option>
                <option value="brand-desc">Ordenar por Marca ↓</option>
                <option value="model-asc">Ordenar por Modelo ↑</option>
                <option value="model-desc">Ordenar por Modelo ↓</option>
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
        
        <div className="firmware-list">
          {currentFirmwares.map((fw) => (
            <div
              key={fw.id}
              className="firmware-card"
              >
                <div className="firmware-name">
                  <p>{fw.brand} - {fw.model}</p>
                  <p>Instalación {fw.instalation}</p>
                </div>
  
                <div className="card-section">
                  <img
                  src={firmwareImage}
                  alt={`Firmware ${fw.brand} ${fw.model}`}
                  className="firmware-image"
                  />
                  <p className="firmwares-price">
                    $7999
                    <span className='price-decimals'>99</span>
                  </p>
                  <RouteButton text="Ver Firmware" route={`/firmwares/${fw.id}`}/>
                </div>
              </div>
            )
          )};
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

export default Firmwares;