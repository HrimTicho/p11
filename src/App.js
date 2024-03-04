import './App.css';
import Home from './Pages/Home/index';
import Connexion from './Pages/Connexion/index';
import Profil from './Pages/Profil/index';
import Error from './Pages/Error/index';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/connexion' element={<Connexion />} />
      <Route path='/profil' element={<Profil />} />
      <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
