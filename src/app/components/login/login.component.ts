import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Quita la importación de HttpHeaders
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  dni: string = '';
  password: string = '';
  notificationMessage: string = '';

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private router: Router,
              private http: HttpClient,
              private toastr: ToastrService) {} // Inyecta el servicio HttpClient aquí

  ngAfterViewInit() {
    const sign_in_btn = this.elementRef.nativeElement.querySelector("#sign-in-btn");
    const sign_up_btn = this.elementRef.nativeElement.querySelector("#sign-up-btn");
    const container = this.elementRef.nativeElement.querySelector(".container");

    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }

  onLogin() {
    this.http.post<any>('https://dioses121.pythonanywhere.com/api/token/', { dni: this.dni, password: this.password }).pipe(
      catchError(error => {
        console.error('Error al iniciar sesión:', error);
        return throwError(error);
      })
    ).subscribe(
      response => {
        console.log('Respuesta del servidor:', response); // Verificar la respuesta completa del servidor

        // Guardar el token en sessionStorage
        const token = response.access; // Aquí cambia de access_token a access
        sessionStorage.setItem('token', token);

        // Llamar a la función para obtener los datos del usuario actual
        this.getCurrentUserData();

        this.router.navigate(['/Dashboard']);

        // Mostrar notificación de éxito
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');

    },
      error => {
        if (error.status === 401) {
          // Error de autorización, el usuario no está autorizado
          this.toastr.error('Credenciales inválidas. Por favor, inténtalo de nuevo.', 'Error de inicio de sesión');
        } else {
          console.error('Error al iniciar sesión:', error);
          this.toastr.error(`Error al iniciar sesión: ${error.message}`, 'Error de inicio de sesión');
        }
      }
    );
  }

  getCurrentUserData() {
    // Obtener el token almacenado en sessionStorage
    const token = sessionStorage.getItem('token');

    if (token) {
      // Crear las cabeceras de la solicitud con el token de autorización
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('Cabecera de solicitud:', headers); // Imprime la cabecera de la solicitud

      // Realizar la solicitud HTTP para obtener los datos del usuario actual
      this.http.get<any>('https://dioses121.pythonanywhere.com/api/current-user/', { headers }).subscribe(
        userData => {
          console.log('JSON de los datos del usuario actual:', JSON.stringify(userData, null, 2)); // Imprime el JSON de los datos del usuario actual

          // Almacena todos los datos del usuario en sessionStorage
          sessionStorage.setItem('dni', userData.dni);
          sessionStorage.setItem('apel_nomb', userData.apel_nomb);
          sessionStorage.setItem('tipo_usuarioapp', userData.tipo_usuarioapp);
          sessionStorage.setItem('imagen_usuario', userData.imagen_usuario);
          sessionStorage.setItem('descripcion', userData.descripcion);
          sessionStorage.setItem('fecha_nacimiento', userData.fecha_nacimiento);
          sessionStorage.setItem('telefono', userData.telefono);
          sessionStorage.setItem('gmail', userData.gmail);
        },
        error => {
          console.error('Error al obtener los datos del usuario actual:', error);
          // Manejar el error de obtener datos del usuario actual
        }
      );
    } else {
      console.error('No hay token disponible para la solicitud.');
      // Manejar el caso en el que no haya un token disponible
    }
  }

}
