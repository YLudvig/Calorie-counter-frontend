//Behöver enbart importera App.css i denna, komponenter som nyttjas i denna får automatisk styling
import './App.css'
import Calcounter from './Components/calcounter/Calcounter'
import Login from './Components/Login/Login';
import RegisterForm from './Components/Login/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ProtectedRoute from './Utilities/ProtectedRoute';
import { useState } from 'react';
import type { User } from './types/AuthTypes';
import WeightTracking from './Components/weighttracking/WeightTracking';

function App() {

  const [user, setUser] = useState<User | null>(null);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route
          path='/calcounter'
          element={
            <ProtectedRoute user={user}>
              {user && <Calcounter user={user} setUser={setUser}/>}
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/weighttracking'
          element={
            <ProtectedRoute user={user}>
              {user && <WeightTracking user={user} setUser={setUser}/>}
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
