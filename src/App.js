import { Routes, Route } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Home from './Home';
import Report from './Report';
import Site from './Site';
import Plant from './Plant';
import './App.css';
function App() {
  return (
    <div>
      <AppNavbar/>
      <Routes>
        <Route path="/" element={<Plant/>} />
        {/* <Route path="/site" element={<Site/>} /> */}
        <Route path="/plant" element={<Plant/>}/>
        <Route path="/report" element={<Report/>} />
      </Routes>
    
    </div>
  );
}

export default App;
