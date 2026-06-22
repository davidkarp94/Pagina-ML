import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import Product from "./components/product/Product";
import Firmwares from "./pages/firmwares/Firmwares";
import Firmware from "./components/firmware/Firmware";
import Guide from "./pages/guide/Guide";
import Footer from "./components/footer/Footer";

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/products" element={ <Products /> } />
        <Route path="/products/:id" element={ <Product /> } />
        <Route path="/firmwares" element={ <Firmwares /> } />
        <Route path="/firmwares/:id" element={ <Firmware /> } />
        <Route path="/guide" element={ <Guide /> } />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
