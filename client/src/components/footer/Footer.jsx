import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaShippingFast, FaRegCreditCard } from 'react-icons/fa';
import { RiShieldCheckLine, RiCustomerService2Fill } from "react-icons/ri";
import { PiGearBold, PiLockBold } from "react-icons/pi";
import { FiMail } from "react-icons/fi";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { BsShieldCheck } from "react-icons/bs";
import logo from '../../../data/logonkalt.png';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">

          {/* Columna 1 */}
          <div className="footer-col logo-col">
            <img src={logo} alt="NK Repuestos Marcos Paz" className='footer-logo' />
            <p className="footer-description">
              Especialistas en Repuestos y Firmwares para Televisores LED, LCD y Smart Tv.
            </p>
            <div className="footer-badges">
              <div className="footer-badges-text">
                <RiShieldCheckLine />
                <p>Productos Verificados</p>
              </div>
              <div className="footer-badges-text">
                <PiGearBold />
                <p>Asesoramiento Técnico</p>
              </div>
              <div className="footer-badges-text">
                <PiLockBold />
                <p>Compra Segura</p>
              </div>
              <div className="footer-badges-text">
                <FaShippingFast />
                <p>Envíos a Todo el País</p>
              </div>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="footer-col nav-col">
              <h4>NAVEGACIÓN</h4>
              <Link to="/"><p>Inicio</p></Link>
              <Link to="/products"><p>Repuestos</p></Link>
              <Link to="/firmwares"><p>Firmwares</p></Link>
              <Link to="/guide"><p>Guía de Compra</p></Link>
          </div>

          {/* Columna 3 */}
          <div className="footer-col info-col-container">
            <h4>INFORMACIÓN</h4>
            <div className="info-col">
              <FaShippingFast />
              <div className="info-col-texto">
                <strong>Envíos a Todo el País</strong>
                <p>Trabajamos con Servicio de Correo y Transporte.</p>
              </div>
            </div>
            <div className="info-col">
              <FaRegCreditCard />
              <div className="info-col-texto">
                <strong>Medios de Pago</strong>
                <p>Transferencia Bancaria o MercadoPago.</p>
              </div>
            </div>
            <div className="info-col">
              <RiShieldCheckLine />
              <div className="info-col-texto">
                <strong>Compra 100% Segura</strong>
                <p>Tus datos están protegidos.</p>
              </div>
            </div>
          </div>

          {/* Columna 4 */}
          <div className="footer-col contact-col">
            <h4>CONTACTO</h4>
            <div className="contact-col-texto">
              <FaWhatsapp />
              <a href="https://wa.me/5491150943302" target="_blank" rel="noopener noreferrer">
                <p>Consultanos por WhatsApp</p>
              </a>
            </div>
            <div className="contact-col-texto">
              <FiMail />
              <p>nkrepuestos@gmail.com.ar</p>
            </div>
            <div className="contact-col-texto">
              <IoLocationOutline />
              <p>Marcos Paz, Buenos Aires</p>
            </div>
            <div className="contact-col-texto">
              <IoTimeOutline />
              <p>Lunes a Viernes de 8 a 12hs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>© 2026 NK Repuestos Marcos Paz. Todos los derechos reservados.</p>
          <div className="footer-secure">
            <BsShieldCheck />
            <div className="footer-secure-text">
              <strong>Sitio Protegido</strong>
              <p>SSL Encriptado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Amarilla */}
      <div className="footer-yellow">
        <div className="footer-container yellow-content">
          <div className="help-text-container">
            <RiCustomerService2Fill />
            <div className="help-text">
              <strong>Necesitás ayuda para encontrar el Repuesto o Firmware que buscás?</strong>
              <p>Nuestro equipo está para asesorarte.</p>
            </div>
          </div>
          <a href="https://wa.me/5491150943302" target="_blank" rel="noopener noreferrer" className="yellow-whatsapp-btn">
            <FaWhatsapp /> Consultanos por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer