import { Routes } from '@angular/router';
import { GuardarUsuarios } from './Componentes/guardar-usuarios/guardar-usuarios';
import { Login } from './Componentes/login/login';
import { ListarEmpleados } from './Componentes/listar-empleados/listar-empleados';
import { guardGuard } from './Guards/guard-guard';
import { ListarCompanias } from './Componentes/listar-companias/listar-companias';
import { ListarDocumentos } from './Componentes/listar-documentos/listar-documentos';
import { EditarCompanias } from './Componentes/editar-companias/editar-companias';
import { EditarEmpleados } from './Componentes/editar-empleados/editar-empleados';
import { Guardar } from './Componentes/guardar/guardar';
import { EditarDocumentos } from './Componentes/editar-documentos/editar-documentos';

export const routes: Routes = [

    {
        path: 'registros',
        component: GuardarUsuarios
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'listar-empleados',
        component: ListarEmpleados,
        canActivate: [guardGuard]
    },
    {
        path: 'listar-companias',
        component: ListarCompanias,
        canActivate: [guardGuard]
    },
    {
        path: 'listar-documentos',
        component: ListarDocumentos,
        canActivate: [guardGuard]
    },
    {
        path: 'editar-companias',
        component: EditarCompanias,
        canActivate: [guardGuard]
    },
    {
        path: 'editar-empleados',
        component: EditarEmpleados,
        canActivate: [guardGuard]
    },
    {
        path: 'editar-documentos',
        component: EditarDocumentos,
        canActivate: [guardGuard]
    },
    {
        path: 'guardar',
        component: Guardar,
        canActivate: [guardGuard],
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login',
    }

];
