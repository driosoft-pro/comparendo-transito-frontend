import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UsersList from "./pages/users/UsersList.jsx";
import UserForm from "./pages/users/UserForm.jsx";
import QuejasList from "./pages/quejas/QuejasList.jsx";
import QuejaForm from "./pages/quejas/QuejaForm.jsx";
import ComparendosList from "./pages/comparendos/ComparendosList.jsx";
import ComparendoForm from "./pages/comparendos/ComparendoForm.jsx";
import PerfilesList from "./pages/perfiles/PerfilesList.jsx";
import PerfilForm from "./pages/perfiles/PerfilForm.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Usuarios */}
          <Route path="/usuarios" element={<UsersList />} />
          <Route path="/usuarios/nuevo" element={<UserForm />} />
          <Route path="/usuarios/:id" element={<UserForm />} />

          {/* Perfiles */}
          <Route path="/perfiles" element={<PerfilesList />} />
          <Route path="/perfiles/nuevo" element={<PerfilForm />} />
          <Route path="/perfiles/:id" element={<PerfilForm />} />

          {/* Comparendos */}
          <Route path="/comparendos" element={<ComparendosList />} />
          <Route path="/comparendos/nuevo" element={<ComparendoForm />} />
          <Route path="/comparendos/:id" element={<ComparendoForm />} />

          {/* Quejas */}
          <Route path="/quejas" element={<QuejasList />} />
          <Route path="/quejas/nuevo" element={<QuejaForm />} />
          <Route path="/quejas/:id" element={<QuejaForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default App;
