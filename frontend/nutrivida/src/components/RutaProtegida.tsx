import React from 'react';
import { Navigate } from 'react-router-dom';

interface RutaProtegidaProps {
  children: React.ReactElement;
  rolPermitido: string;
}

export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ children, rolPermitido }) => {
  const usuarioGuardado = localStorage.getItem('nutrivida_usuario_activo');

  if (!usuarioGuardado) {
    return <Navigate to="/login" replace />;
  }

  try {
    const usuario = JSON.parse(usuarioGuardado);
    const rolUsuario = String(usuario.rol || '').toUpperCase();

    if (!rolUsuario.includes(rolPermitido.toUpperCase())) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem('nutrivida_usuario_activo');
    return <Navigate to="/login" replace />;
  }
};