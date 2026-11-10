import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../atomos/Boton';
import type { ServicioNutricional } from '../data/ListadoServicios';
import type { ComprobantePago } from '../moleculas/CardComprobantePago';

interface FormularioPagoProps {
  servicio: ServicioNutricional;
  rutInicial?: string;
  alConfirmarPago: (comprobante: ComprobantePago) => void;
}

const FormularioPago: React.FC<FormularioPagoProps> = ({
  servicio,
  rutInicial = '',
  alConfirmarPago,
}) => {
  const navigate = useNavigate();

  const [metodoPago, setMetodoPago] = useState<string>('Debito');
  const [titular, setTitular] = useState<string>('');
  const [rut, setRut] = useState<string>(rutInicial);
  const [correo, setCorreo] = useState<string>('');
  const [numeroTarjeta, setNumeroTarjeta] = useState<string>('');
  const [vencimiento, setVencimiento] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const sesionStr = localStorage.getItem('nutrivida_usuario_activo');
    if (sesionStr) {
      try {
        const usuario = JSON.parse(sesionStr);
        if (usuario.nombres) {
          setTitular(`${usuario.nombres} ${usuario.apellidos || ''}`.trim());
        }
        if (usuario.rut) setRut(usuario.rut);
        if (usuario.correo) setCorreo(usuario.correo);
      } catch {
      }
    }
    if (rutInicial) {
      setRut(rutInicial);
    }
  }, [rutInicial]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (titular.trim().length < 3) {
      setError('Debe ingresar el nombre completo del titular de la tarjeta');
      return;
    }

    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      setError('El RUT debe tener entre 8 y 9 caracteres sin puntos ni guión');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      setError('Debe ingresar un correo electrónico válido para el comprobante');
      return;
    }

    const tarjetaLimpia = numeroTarjeta.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(tarjetaLimpia)) {
      setError('El número de tarjeta debe contener exactamente 16 dígitos numéricos');
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento.trim())) {
      setError('La fecha de vencimiento debe tener el formato MM/AA (ej: 08/28)');
      return;
    }

    if (!/^\d{3}$/.test(cvv.trim())) {
      setError('El código de seguridad CVV debe tener exactamente 3 dígitos');
      return;
    }

    const nuevoComprobante: ComprobantePago = {
      idTransaccion: `PAY-${Date.now().toString().slice(-6)}`,
      servicioNombre: servicio.nombre,
      codigoServicio: servicio.codigo,
      monto: servicio.precio,
      titular: titular.trim(),
      rut: rutLimpio,
      correo: correo.trim(),
      metodoPago,
      ultimos4Digitos: tarjetaLimpia.slice(-4),
      fechaPago: new Date().toISOString().split('T')[0],
    };

    alConfirmarPago(nuevoComprobante);
  };

  return (
    <div className="card shadow-sm border-0 p-4 h-100">
      <h3
        className="fw-bold mb-3 pb-2 text-center"
        style={{ color: '#2a492a', borderBottom: '3px solid #2a492a' }}
      >
        Portal de Pago Seguro
      </h3>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="pago-metodo" className="form-label fw-bold">
            Método de Pago
          </label>
          <select
            id="pago-metodo"
            className="form-select"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="Debito">Tarjeta de Débito (Redcompra / Webpay)</option>
            <option value="Credito">Tarjeta de Crédito Bancaria</option>
            <option value="Prepago">Tarjeta de Prepago</option>
          </select>
        </div>

        <div className="row">
          <div className="col-md-7 mb-3">
            <label htmlFor="pago-titular" className="form-label fw-bold">
              Nombre del Titular
            </label>
            <input
              type="text"
              id="pago-titular"
              className="form-control"
              placeholder="Ej: Diego Rivas"
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
              required
            />
          </div>

          <div className="col-md-5 mb-3">
            <label htmlFor="pago-rut" className="form-label fw-bold">
              RUT (sin puntos ni guión)
            </label>
            <input
              type="text"
              id="pago-rut"
              className="form-control"
              placeholder="188663338"
              maxLength={9}
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="pago-correo" className="form-label fw-bold">
            Correo Electrónico para Comprobante
          </label>
          <input
            type="email"
            id="pago-correo"
            className="form-control"
            placeholder="cliente@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="pago-tarjeta" className="form-label fw-bold">
            Número de Tarjeta (16 dígitos)
          </label>
          <input
            type="text"
            id="pago-tarjeta"
            className="form-control"
            placeholder="4532019283746512"
            maxLength={16}
            value={numeroTarjeta}
            onChange={(e) => setNumeroTarjeta(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="pago-vencimiento" className="form-label fw-bold">
              Fecha de Vencimiento (MM/AA)
            </label>
            <input
              type="text"
              id="pago-vencimiento"
              className="form-control"
              placeholder="08/28"
              maxLength={5}
              value={vencimiento}
              onChange={(e) => setVencimiento(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="pago-cvv" className="form-label fw-bold">
              Código CVV (3 dígitos)
            </label>
            <input
              type="password"
              id="pago-cvv"
              className="form-control"
              placeholder="123"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary w-50 fw-semibold"
            onClick={() => navigate('/servicios')}
          >
            Cancelar
          </button>
          <Boton
            label={`Pagar $${servicio.precio} CLP`}
            tipo="submit"
            className="btn btn-success w-50 fw-bold"
          />
        </div>
      </form>
    </div>
  );
};

export default FormularioPago;