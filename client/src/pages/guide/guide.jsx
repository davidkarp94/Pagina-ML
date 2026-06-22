import React from 'react';
import step1 from '../../../data/step1.jpg';
import step2 from '../../../data/step2.jpg';
import step3 from '../../../data/step3.jpg';
import step4 from '../../../data/step4.jpg';
import step5 from '../../../data/step5.jpg';
import { FaWhatsapp } from 'react-icons/fa';
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiCheckBadge } from "react-icons/hi2";
import './guide.css';

const Guide = () => {
  return (
    <div className='guide-container'>
      <div className="guide-title">
        <p className='first-line'>¿CÓMO COMPRAR EN</p>
        <p className='second-line'>NK REPUESTOS <span>MARCOS PAZ</span>?</p>

        <div className="subtitle-container">
          <p className="subtitle">Es muy fácil, seguí estos pasos y nosotros nos encargamos del resto.</p>
          <div className="yellow-line"></div>
        </div>
      </div>

      {/* Contenedor de las Cards */}
      <div className="guide-steps">

        {/* Paso 1 */}
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <div className="step-image">
              <img src={step1} alt="Paso 1" />
            </div>
            <div className="step-text">
              <h3>Encontrá el Producto que necesitás</h3>
              <p>Buscá el Repuesto o Firmware que corresponde a tu equipo.</p>
              <p>Si tenés dudas sobre compatibilidad, podés utilizar el botón de consultas.</p>
              <p>Luego, hacé click en "Continuar con la Compra".</p>
            </div>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-image">
              <img src={step2} alt="Paso 2" />
            </div>
            <div className="step-text">
              <h3>Ingresa al Chat de WhatsApp</h3>
              <p>Se abrirá automáticamente una conversación de Whatsapp con un mensaje preescrito indicando el producto de tu interés.</p>
              <p>A través del chat confirmaremos la disponibilidad del Producto y responderemos todas tus consultas.</p>
            </div>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <div className="step-image">
              <img src={step3} alt="Paso 3" />
            </div>
            <div className="step-text">
              <h3>Coordinamos el pago</h3>
              <p>Te enviaremos los datos para realizar el pago mediante Transferencia Bancaria o MercadoPago.</p>
              <p>Una vez realizado el pago, deberás enviarnos el comprobante para verificar la acreditación.</p>
            </div>
          </div>
        </div>

        {/* Paso 4 */}
        <div className="step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <div className="step-image">
              <img src={step4} alt="Paso 4" />
            </div>
            <div className="step-text">
              <h3>Preparación del Pedido</h3>
              <p>Luego de confirmar el pago, comenzaremos a preparar tu pedido.</p>
              <p>Te solicitaremos los datos de envío o coordinaremos el retiro en domicilio, según la modalidad que prefieras.</p>
            </div>
          </div>
        </div>

        {/* Paso 5 */}
        <div className="step-card">
          <div className="step-number">5</div>
          <div className="step-content">
            <div className="step-image">
              <img src={step5} alt="Paso 5" />
            </div>
            <div className="step-text">
              <h3>Envío o Retiro</h3>
              <p>Realizamos envíos mediante Correo Argentino o Vía Cargo.</p>
              <p>Los costos de envío son a cargo del comprador y se abonan al recibir el paquete (Contrarreembolso)</p>
              <p>También podés retirar personalmente en nuestro domicilio, coordinando previamente por Whatsapp.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Consultas */}

      <div className="guide-help">
        <div className="guide-help-container help-content">
          <div className="guide-help-text-container">
            <RiCustomerService2Fill />
            <div className="guide-help-text">
              <strong>¿No sabés qué repuesto necesita tu TV?</strong>
              <p>Envianos una foto del modelo o del código de la placa por Whatsapp y te ayudaremos a identificar el producto correcto antes de comprar.</p>
            </div>
          </div>
          <a href="https://wa.me/5491150943302" target="_blank" rel="noopener noreferrer" className="guide-whatsapp-btn">
            <FaWhatsapp /> Consultanos por WhatsApp
          </a>
        </div>
      </div>

      {/* Checks */}
      <div className="check-container">
        <div className="check">
          <HiCheckBadge />
          <p>Productos verificados y probados</p>
        </div>

        <div className="check">
          <HiCheckBadge />
          <p>Asesoramiento técnico</p>
        </div>

        <div className="check">
          <HiCheckBadge />
          <p>Compra segura y protegida</p>
        </div>

        <div className="check">
          <HiCheckBadge />
          <p>Envíos a todo el país</p>
        </div>
      </div>
    </div>
  )
}

export default Guide