import React from 'react';
import { Link } from 'react-router-dom';

export interface ComprobantePago {
  idTransaccion: string;
  servicioNombre: string;
  codigoServicio: string;
  monto: number;
  titular: string;
  rut: string;
  correo: string;
  metodoPago: string;
  ultimos4Digitos: string;
  fechaPago: string;
}

interface CardComprobantePagoProps {
  comprobante: ComprobantePago;
}

const CardComprobantePago: React.FC<CardComprobantePagoProps> = ({ comprobante }) => {
  return (
    <div
      className="card shadow border-0 p-4 p-md-5 mx-auto text-center"
      style={{ maxWidth: '600px', borderRadius: '16px' }}
    >
      <div className="mb-3">
        <span className="badge bg-success fs-6 px-3 py-2">Transacción Aprobada</span>
      </div>
      <h2 className="fw-bold text-success mb-2">¡Pago realizado con éxito!</h2>
      <p className="text-muted mb-4">
        Hemos enviado el comprobante electrónico a <strong>{comprobante.correo}</strong>
      </p>

      <div className="bg-light p-3 rounded text-start mb-4 border">
        <p className="mb-1">
          <strong>N° Transacción:</strong> {comprobante.idTransaccion}
        </p>
        <p className="mb-1">
          <strong>Servicio Contratado:</strong> {comprobante.servicioNombre} (
          {comprobante.codigoServicio})
        </p>
        <p className="mb-1">
          <strong>Titular:</strong> {comprobante.titular} (RUT: {comprobante.rut})
        </p>
        <p className="mb-1">
          <strong>Medio de Pago:</strong> {comprobante.metodoPago} terminada en ****{' '}
          {comprobante.ultimos4Digitos}
        </p>
        <p className="mb-0 fs-5 text-success fw-bold mt-2 pt-2 border-top">
          Monto Pagado: ${comprobante.monto} CLP
        </p>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <Link to="/servicios" className="btn btn-outline-success fw-bold">
          Volver a Servicios
        </Link>
        <Link
          to="/usuario"
          className="btn btn-success fw-bold"
          style={{
            backgroundColor: 'rgb(49, 78, 34)',
            borderColor: 'rgb(49, 78, 34)',
          }}
        >
          Ir a Mi Portal
        </Link>
      </div>
    </div>
  );
};

export default CardComprobantePago;