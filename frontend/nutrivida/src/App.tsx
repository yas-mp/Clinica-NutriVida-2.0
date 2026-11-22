import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/organismos/Navbar';
import Footer from './components/organismos/Footer';
import { RutaProtegida } from './components/RutaProtegida';

import Inicio from './pages/Inicio';
import Nosotros from './pages/Nosotros';
import Login from './pages/Login';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import { Admin } from './pages/Admin';

import Profesionales from './pages/Profesionales';
import Servicios from './pages/Servicios';
import DetalleServicio from './pages/DetalleServicio';
import RegistroUsuario from './pages/RegistroUsuario';
import ReservasHoras from './pages/ReservasHoras';
import Usuario from './pages/Usuario';
import Nutricionista from './pages/Nutricionista';
import Pago from './pages/Pago';

import './assets/style.css';

function App() {
  const location = useLocation();
  const esAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="nv-page-wrapper">
      {!esAdmin && <Navbar />}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profesionales" element={<Profesionales />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicios/:id" element={<DetalleServicio />} />
        <Route path="/detalle-servicio/:id" element={<DetalleServicio />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/reservas-horas" element={<ReservasHoras />} />
        <Route path="/pago" element={<Pago />} />

        <Route
          path="/admin"
          element={
            <RutaProtegida rolPermitido="ADMIN">
              <Admin />
            </RutaProtegida>
          }
        />
        <Route
          path="/nutricionista"
          element={
            <RutaProtegida rolPermitido="NUTRI">
              <Nutricionista />
            </RutaProtegida>
          }
        />
        <Route
          path="/usuario"
          element={
            <RutaProtegida rolPermitido="PACIENTE">
              <Usuario />
            </RutaProtegida>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;