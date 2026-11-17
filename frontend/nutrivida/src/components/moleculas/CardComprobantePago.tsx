import React from 'react';
import { Link } from 'react-router-dom';
import type { Pago } from '../../services/pagoService';

interface CardComprobantePagoProps {
  comprobante: Pago;
}

function formatearMonto(monto: number): string {
  return monto.toLocaleString('es-CL');
}

function formatearFecha(fecha: string | null | undefined): string {
  if (!fecha) {
    return '—';
  }

  const [anio, mes, dia] = fecha.split('T')[0].split('-');
  if (anio && mes && dia) {
    return `${dia}-${mes}-${anio}`;
  }

  return fecha;
}

function claseEstado(estado: string): string {
  switch (estado) {
    case 'Aprobado':
      return 'badge bg-success fs-6 px-3 py-2';
    case 'Pendiente':
      return 'badge bg-warning text-dark fs-6 px-3 py-2';
    case 'Rechazado':
      return 'badge bg-danger fs-6 px-3 py-2';
    default:
      return 'badge bg-secondary fs-6 px-3 py-2';
  }
}

const CardComprobantePago: React.FC<CardComprobantePagoProps> = ({ comprobante }) => {
  const aprobado = comprobante.estado === 'Aprobado';

  return (
    <div
      className="card shadow border-0 p-4 p-md-5 mx-auto text-center"
      style={{ maxWidth: '600px', borderRadius: '16px' }}
    >
      <div className="mb-3">
        <span className={claseEstado(comprobante.estado)}>
          {aprobado ? 'Transacción Aprobada' : `Pago ${comprobante.estado}`}
        </span>
      </div>
      <h2 className={`fw-bold mb-2 ${aprobado ? 'text-success' : 'text-dark'}`}>
        {aprobado ? '¡Pago realizado con éxito!' : 'Pago registrado'}
      </h2>
      <p className="text-muted mb-4">
        Hemos enviado el comprobante electrónico a <strong>{comprobante.correo}</strong>
      </p>

      <div className="bg-light p-3 rounded text-start mb-4 border">
        <p className="mb-1">
          <strong>N° Comprobante:</strong> {comprobante.numeroComprobante}
        </p>
        <p className="mb-1">
          <strong>Servicio Contratado:</strong> {comprobante.servicioNombre} (
          {comprobante.codigoServicio})
        </p>
        <p className="mb-1">
          <strong>Titular:</strong> {comprobante.titular} (RUT: {comprobante.rutPaciente})
        </p>
        <p className="mb-1">
          <strong>Medio de Pago:</strong> {comprobante.metodoPago} terminada en ****{' '}
          {comprobante.ultimos4Digitos}
        </p>
        <p className="mb-1">
          <strong>Fecha de Pago:</strong> {formatearFecha(comprobante.fechaPago)}
        </p>
        {comprobante.idReserva && (
          <p className="mb-1">
            <strong>Reserva Asociada:</strong> {comprobante.idReserva}
          </p>
        )}
        <p className="mb-0 fs-5 text-success fw-bold mt-2 pt-2 border-top">
          Monto Pagado: ${formatearMonto(comprobante.monto)} CLP
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
