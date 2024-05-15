import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'; // Importa withFetch desde '@angular/common/http'
import { FormsModule } from '@angular/forms'; // Importa FormsModule desde '@angular/forms'
import { LineChartModule, NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardEmpleadoComponent } from './components/dashboard-empleado/dashboard-empleado.component';
import { GraficoBarrasComponent } from './components/grafico-barras/grafico-barras.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardEmpleadoComponent,
    GraficoBarrasComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    IonicModule,
    LineChartModule
  ],
  providers: [
    // Solo proporciona HttpClientModule a provideHttpClient
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
