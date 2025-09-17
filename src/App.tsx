import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import './frontend/App.css';
import LandingPage from "./frontend/LandingPage";
import AdminLogin from "./frontend/AdminLogin";
import AdminPanel from "./frontend/AdminPanel";

function App() {
    return(
          <Routes>
            <Route path='/' element={<LandingPage />}/>
            <Route path='/admin' element={<AdminLogin />}/>
            <Route path='/admin-panel' element={<AdminPanel />}/>
          </Routes>
    )
}

export default App;
