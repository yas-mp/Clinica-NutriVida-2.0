import {Routes, Route} from 'react-router-dom'
import Navbar from './components/organismos/Navbar'
import Nosotros from './pages/Nosotros'
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Contacto from './pages/Contacto';


function App(){
  return(
    <>
    <Navbar/>

    <Routes>
      <Route
        path='/'
        element={<Inicio/>}
        />

        <Route
        path='/nosotros'
        element={<Nosotros/>}
        />

        <Route
        path='/login'
        element={<Login/>}
        />

        <Route
        path='/contacto'
        element={<Contacto/>}
        />
    </Routes>    


    </>
    
  )
}

export default App;