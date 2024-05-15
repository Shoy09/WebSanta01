import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardEmpleadoComponent } from './components/dashboard-empleado/dashboard-empleado.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'Dashboard', component: DashboardEmpleadoComponent},
  // Otras rutas de tu aplicación aquí...
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a la página de inicio de sesión si la ruta es vacía
  { path: '**', redirectTo: '/login' } // Redirige a la página de inicio de sesión si la ruta no coincide con ninguna ruta definida
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
