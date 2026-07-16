import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Navigate import kiya

import Layout from './components/Layout';
import Ec2Page from './pages/Ec2Page.jsx';
import Overview from './pages/Overview.jsx';
import S3Page from './pages/S3Page.jsx';
import Login from './pages/LoginPage.jsx'; 

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {

  // Authentication status track karne ke liye state (Local storage taake refresh pe logout na ho)
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  return (
    <Routes>
      
      <Route path='/login' element={<Login setAuth={setIsAuthenticated} />} />

      
      <Route 
        path='/' 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
             
            <Layout setAuth={setIsAuthenticated} /> 
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path='ec2' element={<Ec2Page />} />
        <Route path="s3" element={<S3Page />} />
      </Route>
    </Routes>
  );
}

export default App;