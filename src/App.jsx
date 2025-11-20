import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import UsersList from "./pages/users/UsersList.jsx";
import UserForm from "./pages/users/UserForm.jsx";

import PerfilesList from "./pages/perfiles/PerfilesList.jsx";
import PerfilForm from "./pages/perfiles/PerfilForm.jsx";

import VehiculosList from "./pages/vehiculos/VehiculosList.jsx";
import VehiculoForm from "./pages/vehiculos/VehiculoForm.jsx";

import CategoriasLicenciaList from "./pages/CategoriasLicencia/CategoriasLicenciaList";
import CategoriaLicenciaForm from "./pages/CategoriasLicencia/CategoriaLicenciaForm";

import LicenciasList from "./pages/licencias/LicenciasList.jsx";
import LicenciaForm from "./pages/licencias/LicenciaForm.jsx";

import SecretariasList from "./pages/secretarias/SecretariasList.jsx";
import SecretariaForm from "./pages/secretarias/SecretariaForm.jsx";

import MunicipiosList from "./pages/municipios/MunicipiosList.jsx";
import MunicipioForm from "./pages/municipios/MunicipioForm.jsx";

import ComparendosList from "./pages/comparendos/ComparendosList.jsx";
import ComparendoForm from "./pages/comparendos/ComparendoForm.jsx";

import InfraccionesList from "./pages/infracciones/InfraccionesList.jsx";
import InfraccionForm from "./pages/infracciones/InfraccionForm.jsx";

import QuejasList from "./pages/quejas/QuejasList.jsx";
import QuejaForm from "./pages/quejas/QuejaForm.jsx";

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

          {/* Vehiculos */}
          <Route path="/vehiculos" element={<VehiculosList />} />
          <Route path="/vehiculos/nuevo" element={<VehiculoForm />} />
          <Route path="/vehiculos/:id" element={<VehiculoForm />} />

          {/* Categorias Licencias */}
          <Route
            path="/categorias-licencia"
            element={<CategoriasLicenciaList />}
          />
          <Route
            path="/categorias-licencia/nuevo"
            element={<CategoriaLicenciaForm />}
          />
          <Route
            path="/categorias-licencia/editar/:id"
            element={<CategoriaLicenciaForm />}
          />

          {/* Licencias */}
          <Route path="/licencias" element={<LicenciasList />} />
          <Route path="/licencias/nuevo" element={<LicenciaForm />} />
          <Route path="/licencias/:id" element={<LicenciaForm />} />

          {/* Secretarias */}
          <Route path="/secretarias" element={<SecretariasList />} />
          <Route path="/secretarias/nuevo" element={<SecretariaForm />} />
          <Route path="/secretarias/:id" element={<SecretariaForm />} />

          {/* Municipios */}
          <Route path="/municipios" element={<MunicipiosList />} />
          <Route path="/municipios/nuevo" element={<MunicipioForm />} />
          <Route path="/municipios/:id" element={<MunicipioForm />} />

          {/* Comparendos */}
          <Route path="/comparendos" element={<ComparendosList />} />
          <Route path="/comparendos/nuevo" element={<ComparendoForm />} />
          <Route path="/comparendos/:id" element={<ComparendoForm />} />

          {/* Infracciones */}
          <Route path="/infracciones" element={<InfraccionesList />} />
          <Route path="/infracciones/nuevo" element={<InfraccionForm />} />
          <Route path="/infracciones/:id" element={<InfraccionForm />} />

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
