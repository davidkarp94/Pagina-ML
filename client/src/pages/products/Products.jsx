import React, { useState, useEffect, useRef } from 'react';
import './products.css';

const data = [
  { id: 1, name: "Producto A", price: 5000, category: "Electrónica" },
  { id: 2, name: "Producto B", price: 3000, category: "Hogar" },
  { id: 3, name: "Producto C", price: 8000, category: "Electrónica" },
  { id: 4, name: "Producto D", price: 2000, category: "Juguetes" },
  { id: 5, name: "Producto E", price: 6000, category: "Hogar" },
  { id: 6, name: "Producto F", price: 7000, category: "Electrónica" },
  { id: 7, name: "Producto G", price: 4500, category: "Juguetes" },
  { id: 8, name: "Producto H", price: 2500, category: "Hogar" },
  { id: 9, name: "Producto I", price: 1000, category: "Juguetes" },
  { id: 10, name: "Producto J", price: 9000, category: "Electrónica" },
  { id: 11, name: "Producto K", price: 8500, category: "Hogar" },
  { id: 12, name: "Producto L", price: 1200, category: "Juguetes" },
  { id: 13, name: "Producto M", price: 5300, category: "Electrónica" },
  { id: 14, name: "Producto N", price: 4700, category: "Hogar" },
  { id: 15, name: "Producto O", price: 3200, category: "Juguetes" },
];

const categories = ["Todas", "Electrónica", "Hogar", "Juguetes"];

const Products = () => {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const catRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(catRef.current && !catRef.current.contains(event.target)) {
        setIsCatOpen(false);
      }
      if(priceRef.current && !priceRef.current.contains(event.target)) {
        setIsPriceOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const productsPerPage = 12;

  const filteredData = data
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "Todas" || product.category === category)
    )
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

    const totalPages = Math.ceil(filteredData.length / productsPerPage);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredData.slice(indexOfFirstProduct, indexOfLastProduct);

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

        <div className={`select-container ${isCatOpen ? "cat-open" : ""}`} ref={catRef}>
          <select 
          value={category} 
          onClick={() => setIsCatOpen((prev) => !prev)}
          onBlur={() => setTimeout(() => setIsCatOpen(false), 200)}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
            setTimeout(() => setIsCatOpen(false), 100);
          }}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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

      <div className="product-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <p className="product-name">{product.name}</p>
            <img 
            src="https://i0.wp.com/ricedh.org/wp-content/uploads/2020/11/qi-bin-w4hbafegiac-unsplash.jpg?fit=1600%2C1066&ssl=1" 
            alt={`Imagen de ${product.name}`} 
            className="product-image"
            />
            <p className="product-price">${product.price}</p>
            <p className="product-category">Categoría: {product.category}</p>
          </div>
        ))};
      </div>

      <div className="pagination">
        <button
        className='pagination-button'
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        >
          {"<"} Anterior
        </button>

        <span>Página {currentPage} de {totalPages}</span>

        <button
        className='pagination-button'
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        >
          Siguiente {">"}
        </button>
      </div>

    </div>
  );
};

export default Products;