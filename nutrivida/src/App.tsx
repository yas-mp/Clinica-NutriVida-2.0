import {Routes, Route} from 'react-router-dom'
import Navbar from './components/organismos/Navbar'
import Nosotros from './pages/Nosotros'
import Inicio from './pages/Inicio';


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
    </Routes>    


    </>
    
  )
}

export default App;