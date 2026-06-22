import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { FaShippingFast, FaWhatsapp } from 'react-icons/fa';
import { RiShieldCheckLine, RiCustomerService2Fill } from "react-icons/ri";
import { PiBookOpenText, PiSealCheck } from "react-icons/pi";
import { FaMicrochip } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { CiDollar } from "react-icons/ci";
import { BiPackage } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import { MdPeople } from "react-icons/md";
import heroImage from '../../../data/homeImage.png';
import aboutUsImage from '../../../data/aboutUs.png';

const Home = () => {
  return (
    <>
      {/* Sección Hero */}
      <div className='home-hero'>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              SOLUCIONES CONFIABLES<br />
              PARA TU <span className='highlight'>TELEVISOR</span>
            </h1>

            <div className="title-underline"></div>

            <p className="hero-subtitle">
              Repuestos originales y Firmwares actualizados<br />
              para todas las marcas.
            </p>

            <p className="hero-description">
              Asesoramiento personalizado y envíos a todo el país.
            </p>

            <div className="hero-features">
              <div className="feature">
                <RiShieldCheckLine />
                <p>Productos verificados</p>
              </div>

              <div className="feature">
                <RiCustomerService2Fill />
                <p>Asesoramiento técnico</p>
              </div>

              <div className="feature">
                <FaShippingFast />
                <p>Envíos a todo el país</p>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img src={heroImage} alt="Repuestos y TV" />
          </div>
        </div>
      </div>

      {/* Sección Cards */}
      <div className="services-section">
        <div className="services-container">

          <div className="service-card">
            <FaMicrochip />
            <h3>Repuestos</h3>
            <p>Encontrá la pieza que necesitás para tu TV o electrodoméstico entre nuestro catálogo de repuestos.</p>
            <Link to="/products" className='service-btn'>Ver Repuestos →</Link>
          </div>

          <div className="service-card">
            <FiDownload />
            <h3>Firmwares</h3>
            <p>Actualizá el software de tu TV y solucioná problemas de sistema o rendimiento.</p>
            <Link to="/firmwares" className='service-btn'>Ver Firmwares →</Link>
          </div>

          <div className="service-card">
            <PiBookOpenText />
            <h3>Guía Paso a Paso</h3>
            <p>Conocé cómo comprar en nuestra tienda de forma fácil, rápida y segura.</p>
            <Link to="/guide" className='service-btn'>Ver Guía →</Link>
          </div>

        </div>
      </div>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="trust-container">

          <div className="trust-item">
            <PiSealCheck />
            <h4>Compra Segura</h4>
            <p>Tus datos y pagos están protegidos.</p>
          </div>

          <div className="trust-item">
            <CiDollar />
            <h4>Pagá como prefieras</h4>
            <p>Transferencia Bancaria o MercadoPago.</p>
          </div>

          <div className="trust-item">
            <BiPackage />
            <h4>Envíos a todo el país</h4>
            <p>Por Correo Argentino o Vía Cargo.</p>
          </div>

          <div className="trust-item">
            <IoLocationOutline />
            <h4>Retirá en Marcos Paz</h4>
            <p>Podés retirar tu pedido por nuestro local.</p>
          </div>
        </div>
      </div>

      {/* Sobre Nosotros */}
      <div className="about-section">
        <div className="about-container">

          <div className="about-image">
            <img src={aboutUsImage} alt="NK Repuestos Marcos Paz" />
          </div>

          <div className="about-content">
            <div className="about-header">
              <h2>Sobre Nosotros</h2>
              <div className="about-underline"></div>
            </div>

            <h3>Somos una empresa familiar de Marcos Paz</h3>

            <p>
              Nos especializamos en Repuestos y Firmwares para Televisores LED, LCD y Smart TV, además de otros electrodomésticos como Heladeras, Lavarropas, etc.<br />
              Brindamos soluciones confiables con asesoramiento personalizado para técnicos y particulares.
            </p>

            <div className="attention-box">
              <MdPeople />
              <div>
                <strong>Atención personalizada y dedicada.</strong>
                <p>Estamos para ayudarte antes, durante y después de tu compra.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="guide-help home-guide-help">
        <div className="guide-help-container help-content home-help-content">
          <div className="guide-help-text-container">
            <RiCustomerService2Fill />
            <div className="guide-help-text">
              <strong>¿Tenés dudas o no sabés que Repuesto necesitás?</strong>
              <p>Escribinos por WhatsApp y nuestro equipo te asesorará sin compromiso.</p>
            </div>
          </div>
          <a href="https://wa.me/5491150943302" target="_blank" rel="noopener noreferrer" className="guide-whatsapp-btn">
            <FaWhatsapp /> Consultanos por WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}

export default Home