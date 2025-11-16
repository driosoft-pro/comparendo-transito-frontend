
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/layout/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UsersList from './pages/users/UsersList.jsx';
import UserForm from './pages/users/UserForm.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/usuarios" element={<UsersList />} />
          <Route path="/usuarios/nuevo" element={<UserForm />} />
          <Route path="/usuarios/:id" element={<UserForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default App;
