import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Obtiene el token de acceso almacenado en sessionStorage
    const token = sessionStorage.getItem('token');

    // Si hay un token, adjúntalo a la cabecera 'Authorization' de la solicitud
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continúa con la solicitud modificada
    return next.handle(request);
  }
}
