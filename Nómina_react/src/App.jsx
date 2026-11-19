import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';

import ProtectedRoute from './Components/ProtectedRoute';
import RoleRoute from './Components/RoleRoute';
import MainLayout from './Components/MainLayout';
import PublicRoute from './Components/PublicRoute';

import Registro from './pages/Registro';
import RecuperarPassword from './pages/RecuperarPassword';
import ListarDocumentos from './pages/ListarDocumentos';
import ListarEmpleados from './pages/ListarEmpleados';
import ListarCompanias from './pages/ListarCompanias';
import ListarUsuarios from './pages/ListarUsuarios';
import ActualizarPassword from './pages/ActualizarPassword';
import EditarDocumentos from './pages/EditarDocumentos';
import EditarEmpleados from './pages/EditarEmpleados';
import EditarCompania from './pages/EditarCompanias';
import EditarUsuarios from './pages/EditarUsuarios';
import Guardar from './pages/Guardar';

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
      </Route>

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* Pantalla principal provisional */}
          <Route
            path="listar-companias"
            element={
              <ListarCompanias />
            }
          />

          <Route path="listar-documentos" element={<ListarDocumentos />} />

          <Route path="guardar" element={<Guardar />} />

          <Route path="listar-empleados" element={<ListarEmpleados />} />

          <Route path="listar-companias" element={<ListarCompanias />} />

          <Route path="actualizar-password" element={<ActualizarPassword />} />

          <Route path="editar-documentos" element={<EditarDocumentos />} />

          <Route path="editar-empleados" element={<EditarEmpleados />} />

          <Route path="editar-companias" element={<EditarCompania />} />

          {/* Solo administradores */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="listar-usuarios" element={<ListarUsuarios />} />
            <Route path="/editar-usuarios" element={<EditarUsuarios />} />
          </Route>

        </Route>
      </Route>

      {/* Redirección de rutas desconocidas */}
      <Route path="*" element={<Navigate to="/listar-empleados" replace />} />
    </Routes>
  );
}

export default App;
