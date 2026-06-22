import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firmwareImage from '../../../data/firm.png';
import { FaWhatsapp } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { SlBookOpen } from "react-icons/sl";
import { SiMercadopago } from "react-icons/si";
import { PiNotepadBold } from "react-icons/pi";
import { FaDownload } from "react-icons/fa";
import './firmware.css';

const Firmware = () => {
  const { id } = useParams();
  const [ firmware, setFirmware ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchFirmware = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/data/firmwares.txt');
        if (!response.ok) throw new Error('No se pudieron cargar los Firmwares');

        const allFirmwares = await response.json();

        const foundFirmware = allFirmwares.find((fw, index) => {
            const generatedId = `${fw.brand.toLowerCase()}-${fw.model.toLowerCase()}-${index}`;
            return generatedId === id;
        });

        if (foundFirmware) {
            setFirmware(foundFirmware);
        } else {
            setError('Firmware no encontrado');
        }
    } catch (err) {
        console.error("Error cargando firmware: ", err);
        setError("Error al cargar el firmware");
    } finally {
        setIsLoading(false);
        }
    };

    fetchFirmware();
  }, [id]);

  const whatsappNumber = "5491131727778";

  const getWhatsappHelp = () => {
    if (!firmware) return "#";
    const message = encodeURIComponent(
      `Hola, tengo una consulta acerca del Firmware: "${firmware.brand} ${firmware.model} - Instalación ${firmware.instalation}"\n\n`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const getWhatsappBuy = () => {
    if (!firmware) return "#";
    const message = encodeURIComponent(
      `Hola, me interesa comprar el Firmware: "${firmware.brand} ${firmware.model} - Instalación ${firmware.instalation}"\n`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  if (isLoading) {
    return (
      <div className='firmware-container'>
        <div className="loading">
          Cargando Firmware...
        </div>
      </div>
    )
  }

  if (!firmware) {
    return (
      <div className='firmware-container'>
        <div className="error">
          Firmware no encontrado.
        </div>
      </div>
    )
  }

  return (
    <div className='firmware-container'>
      <p className="firmware-title">Firmware para {firmware.brand} - {firmware.model}</p>

      <div className="firmware-image-container">
        <img 
            src={firmwareImage}
            alt={`Firmware ${firmware.brand} ${firmware.model}`}
            className="firmware-main-image"
        />
      </div>

      <div className="firmware-info-container">
        <div className='firmware-info'>
          <PiNotepadBold />
          <strong>Versión: </strong>
          <div className='firmware-version'>{firmware.version === "" ? "No especificada." : firmware.version}</div>
        </div>
        <div className='firmware-info'>
        <FaDownload />
        <strong>Instalación: </strong>
          <div><span className={firmware.instalation === "Forzada" ? "forzada" : ""}>{firmware.instalation}</span></div>
        </div>
      </div>

      <div className="firmware-disclaimer">
        <p className='disclaimer-title'><strong>Leer antes de comprar:</strong></p>

        <p>
          Los archivos están probados y funcionan, de no solucionar su falla o problema querrá decir que el inconveniente no es de software o no puede ser solucionado con esta herramienta.
        </p>
        <p>
          El modo de instalación puede ser No Forzada, cuando se puede acceder al menú de la TV, o Forzada, cuando la TV no responde y no se puede acceder al menú.
        </p>
        <p>
          Tener en cuenta que se deben tener conocimientos de computación para su descarga, solo se vende y envía el Firmware, sin mano de obra.
        </p>
        <p>
          El Firmware se vende con un archivo que trae las instrucciones para su correcta Instalación.
        </p>
      </div>

      <div className='firmware-price'>
        <strong>Precio:</strong>
        <div className="real-price-container">
          <div className="real-price">
            $7999
            <span className='decimals'>99</span>
          </div>
          <div className="discounted-price-mp">
              <SiMercadopago />
              <p>Transferencia o MercadoPago</p>
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
          <a href={getWhatsappBuy()} target="_blank" rel="noopener noreferrer" className="btn buy-btn">
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
          <a href={getWhatsappHelp()} target="_blank" rel="noopener noreferrer" className='btn help-btn'>
            <FaWhatsapp />
            <p>Consultanos por Whatsapp</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Firmware