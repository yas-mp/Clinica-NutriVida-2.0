import {Routes, Route} from 'react-router-dom'
import Navbar from './components/organismos/Navbar'
import Nosotros from './pages/Nosotros'

function App(){
  return(
    <>
    <Navbar/>

    <Routes>
        <Route
        path='/nosotros'
        element={<Nosotros/>}
        />
    </Routes>    


    </>
  )
}

export default App;