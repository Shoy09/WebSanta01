import { Usuarios } from './../../data/Usuarios';
import moment from 'moment';

import { Component, AfterViewInit, ElementRef, Renderer2, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { ImporteDetalle, Detalle  } from '../../data/ImporteDetalle'; // Asegúrate de importar tu interfaz ImporteDetalle
import { Fechas } from './../../data/Fechas'; // Asegúrate de importar correctamente la interfaz Fechas
import * as descripcionJSON from '../../json/Descripciones.json';
interface DescripcionesEncontradas {
  idactividades: { [key: string]: string };
  idlabores: { [key: string]: string };
}
interface DescripcionesMostradas {
  idactividades: { [key: string]: string };
  idlabores: { [key: string]: string };
}

@Component({
  selector: 'app-dashboard-empleado',
  templateUrl: './dashboard-empleado.component.html',
  styleUrls: ['./dashboard-empleado.component.css']
})
export class DashboardEmpleadoComponent implements OnInit, AfterViewInit {
  listaDeDetalles: Detalle[] = [];
  descripcionesMostradas: DescripcionesMostradas = {
    idactividades: {},
    idlabores: {}
  };
  importeDetalles: ImporteDetalle[] = [];
  importaciones: ImporteDetalle[] = [];
  datosFiltrados: Fechas[] = [];
  totalCantidadConActividadD!: number;
  usuarios: Usuarios[] = [];
  paginaActual: string = 'Dashboard';
  descripcionReporte: string = '';
  dni: string = '';
  idcodigogeneral: string = '';
  apel_nomb: string = '';
  tipo_usuarioapp: string = '';
  imagen_usuario: string = '';

  descripcion: string = '';
  fecha_nacimiento: string = '';
  telefono: string = '';
  gmail: string = '';
  token: string | undefined;
  datosParaGraficoBarras: any[] = [];
  datosParaGraficoDona: any[] = [
    { name: 'Rendimiento 1', value: 25 },
    { name: 'Rendimiento 2', value: 20 },
    { name: 'Rendimiento 3', value: 15 },
    { name: 'Rendimiento 4', value: 10 },
    // Agrega más rendimientos según sea necesario
  ];
  listaDeDetallesConDescripciones: any[] = [];



  constructor(private elementRef: ElementRef, private renderer: Renderer2, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Verificar si sessionStorage está disponible antes de intentar acceder a él
    if (typeof sessionStorage !== 'undefined') {
      // Recuperar los datos almacenados en sessionStorage
      this.dni = sessionStorage.getItem('dni') || '';
      this.idcodigogeneral = sessionStorage.getItem('dni') || '';
      this.apel_nomb = sessionStorage.getItem('apel_nomb') || '';
      this.tipo_usuarioapp = sessionStorage.getItem('tipo_usuarioapp') || '';
      this.imagen_usuario = sessionStorage.getItem('imagen_usuario') || '';
      console.log('Valor de imagen_usuario:', this.imagen_usuario);
      this.descripcion = sessionStorage.getItem('descripcion') || '';
      this.fecha_nacimiento = sessionStorage.getItem('fecha_nacimiento') || '';
      this.telefono = sessionStorage.getItem('telefono') || '';
      this.gmail = sessionStorage.getItem('gmail') || '';
      this.token = sessionStorage.getItem('token')?? '';
        }

    // Verificar si idcodigogeneral tiene un valor válido antes de llamar a fetchImportacionDetails()

    if (this.idcodigogeneral) {
      this.fetchImportacionDetails();
    }
  }
  calcularSumaDeCantidades(): number {
    let suma = 0;
    // Iterar sobre cada detalle y sumar la cantidad
    this.listaDeDetalles.forEach(detalle => {
      suma += parseFloat(detalle.cantidad); // Convertir la cantidad a número antes de sumar
    });
    return suma;
  }

  enviarReporte() {
    const mensaje = `send?phone=51973415832&text=*Reporte de Problema*%0A*DNI:* ${this.dni}%0A*Teléfono:* ${this.telefono}%0A*Descripción del Problema:* ${this.descripcionReporte}%0A*Nombre:* ${this.apel_nomb}%0A*Email:* ${this.gmail}`;
    const url = 'https://web.whatsapp.com/' + mensaje; // Cambia a la URL de WhatsApp si estás en un dispositivo móvil
    window.open(url, '_blank');
  }

  // Función para calcular la media de rendimiento
  calcularMediaDeRendimiento(): string {
    const suma = this.calcularSumaDeCantidades();
    const cantidadTotalDetalles = this.listaDeDetalles.length;
    // Calcular la media de rendimiento
    if (cantidadTotalDetalles > 0) {
      const media = suma / cantidadTotalDetalles;
      return media.toFixed(2); // Redondear a dos decimales y convertir a string
    } else {
      return '0.00'; // Evitar dividir por cero y retornar 0.00 si no hay detalles
    }
  }

  sumarCantidadDetallesConActividadD(): void {
    // Filtrar los detalles cuyo idactividad empieza con 'D'
    const detallesConActividadD = this.listaDeDetalles.filter(detalle => detalle.idactividad.startsWith('D'));

    // Sumar las cantidades de los detalles filtrados
    this.totalCantidadConActividadD = detallesConActividadD.reduce((total, detalle) => {
      // Convertir la cantidad a número y sumarla al total
      return total + parseFloat(detalle.cantidad);
    }, 0);
  }


  ngAfterViewInit() {
    // Verificar si estamos en un entorno de navegador web antes de acceder al DOM
    if (typeof document !== 'undefined') {
      const sideMenu = document.querySelector('aside');
      const menuBtn = document.getElementById('menu-btn');
      const closeBtn = document.getElementById('close-btn');
      const darkMode = document.querySelector('.dark-mode');

      // Verificar si los elementos existen antes de agregar eventos
      if (sideMenu && menuBtn && closeBtn && darkMode) {
        menuBtn.addEventListener('click', () => {
          sideMenu.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
          sideMenu.style.display = 'none';
        });

        darkMode.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode-variables');
          const span1 = darkMode.querySelector('span:nth-child(1)');
          const span2 = darkMode.querySelector('span:nth-child(2)');
          if (span1 && span2) {
            span1.classList.toggle('active');
            span2.classList.toggle('active');
          }
        });
      }
    }
  }


  procesarDatosParaGrafico(detalles: Detalle[]) {
    const cantidadPorLabor: { [key: string]: number } = {};

    detalles.forEach(detalle => {
      if (cantidadPorLabor[detalle.idlabor]) {
        cantidadPorLabor[detalle.idlabor] += parseInt(detalle.cantidad, 10);
      } else {
        cantidadPorLabor[detalle.idlabor] = parseInt(detalle.cantidad, 10);
      }
    });

    this.datosParaGraficoBarras = Object.keys(cantidadPorLabor).map(idlabor => {
      const descripcion = this.obtenerDescripcionLabor(idlabor);
      return { name: descripcion, value: cantidadPorLabor[idlabor] };
    });
  }
  obtenerDescripcionLabor(idlabor: string): string {
    const descripcion = descripcionJSON.data.find((item: any) =>
      item.labores.some((labor: any) => labor.idlabor === idlabor)
    )?.labores.find((labor: any) => labor.idlabor === idlabor)?.descripcion;

    return descripcion || idlabor;
  }

  filtrarPorFecha() {
    const fechaInicioInput = (document.getElementById('fechaInicio') as HTMLInputElement).value;
    const fechaFinInput = (document.getElementById('fechaFin') as HTMLInputElement).value;

    const fechaInicio = fechaInicioInput ? this.convertirFechaAYYYYMMDD(fechaInicioInput) : null;
    const fechaFin = fechaFinInput ? this.convertirFechaAYYYYMMDD(fechaFinInput) : null;

    console.log('Rango de fechas seleccionado:');
    console.log('Fecha de inicio:', fechaInicio);
    console.log('Fecha de fin:', fechaFin);

    const importacionesEnRango = fechaInicio && fechaFin ?
      this.importaciones.filter(importacion => {
        const fechaImportacion = importacion.fecha;
        return fechaImportacion >= fechaInicio && fechaImportacion <= fechaFin;
      }) :
      this.importaciones;

    this.listaDeDetalles = [];

    importacionesEnRango.forEach(importacion => {
      if (importacion.detalle && importacion.detalle.length > 0) {
        this.listaDeDetalles.push(...importacion.detalle.filter(detalle => parseFloat(detalle.cantidad) > 0.0));
      }
    });

    const idactividades: string[] = [];
    const idlabores: string[] = [];
    this.listaDeDetalles.forEach(detalle => {
      if (detalle.idactividad) {
        idactividades.push(detalle.idactividad);
      }
      if (detalle.idlabor) {
        idlabores.push(detalle.idlabor);
      }
    });

    this.mapearJSON(idactividades, idlabores);
    this.procesarDatosParaGrafico(this.listaDeDetalles);
    this.sumarCantidadDetallesConActividadD();

    console.log('Importaciones dentro del rango de fechas:', importacionesEnRango);
  }

  // Función para convertir una fecha al formato YYYYMMDD
  convertirFechaAYYYYMMDD(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}${mes}${dia}`;
  }

  QuitarFiltro() {
    const fechaInicioInput = document.getElementById('fechaInicio') as HTMLInputElement;
    const fechaFinInput = document.getElementById('fechaFin') as HTMLInputElement;
    fechaInicioInput.value = '';
    fechaFinInput.value = '';

    this.listaDeDetalles = [];

    this.importaciones.forEach(importacion => {
      if (importacion.detalle && importacion.detalle.length > 0) {
        this.listaDeDetalles.push(...importacion.detalle.filter(detalle => parseFloat(detalle.cantidad) > 0.0));
      }
    });

    const idactividades: string[] = [];
    const idlabores: string[] = [];
    this.listaDeDetalles.forEach(detalle => {
      if (detalle.idactividad) {
        idactividades.push(detalle.idactividad);
      }
      if (detalle.idlabor) {
        idlabores.push(detalle.idlabor);
      }
    });

    this.mapearJSON(idactividades, idlabores);
    this.procesarDatosParaGrafico(this.listaDeDetalles);
    this.sumarCantidadDetallesConActividadD();
  }

  // Llama a esta función después de obtener los detalles de importación
  fetchImportacionDetails() {
    this.http.get<ImporteDetalle[]>('https://dioses121.pythonanywhere.com/api/importaciones/' + this.idcodigogeneral + '/').subscribe(
      (data: ImporteDetalle[]) => {
        if (data && data.length > 0) {
          this.importaciones = [];
          this.importaciones = data;
          let idactividades: string[] = [];
          let idlabores: string[] = [];
          data.forEach(importeDetalle => {
            if (importeDetalle.detalle && importeDetalle.detalle.length > 0) {
              this.listaDeDetalles.push(...importeDetalle.detalle.filter(detalle => parseFloat(detalle.cantidad) > 0.0));
              importeDetalle.detalle.forEach(detalle => {
                if (detalle.idactividad) {
                  idactividades.push(detalle.idactividad);
                }
                if (detalle.idlabor) {
                  idlabores.push(detalle.idlabor);
                }
              });
            }
          });
          this.mapearJSON(idactividades, idlabores);
          this.procesarDatosParaGrafico(this.listaDeDetalles);
          this.sumarCantidadDetallesConActividadD();
        } else {
          console.error('La respuesta de la solicitud HTTP no tiene los datos esperados:', data);
        }
      },
      (error) => {
        console.error('Error al obtener detalles de importación:', error);
      }
    );
  }


  mapearJSON(idactividades: string[], idlabores: string[]) {
    // Aquí puedes realizar el mapeo JSON con los arreglos idactividades e idlabores
    const jsonData = {
      idactividades: idactividades,
      idlabores: idlabores
    };

    // Buscar descripciones correspondientes en el JSON de descripciones
    const descripcionesEncontradas: DescripcionesEncontradas = {
      idactividades: {},
      idlabores: {}
    };

    // Iterar sobre el JSON de descripciones
    descripcionJSON.data.forEach((item: any) => {
      if (idactividades.includes(item.idactividad)) {
        descripcionesEncontradas.idactividades[item.idactividad] = item.descripcion;
      }
      item.labores.forEach((labor: any) => {
        if (idlabores.includes(labor.idlabor)) {
          descripcionesEncontradas.idlabores[labor.idlabor] = labor.descripcion;
        }
      });
    });

    // Llamar a la función que realiza el mapeo
    this.otraFuncion(jsonData, descripcionesEncontradas);
  }

  otraFuncion(jsonData: any, descripcionesEncontradas: DescripcionesEncontradas) {
    // ...
    // Aquí puedes procesar los datos mapeados como desees
    // Mostrar las descripciones encontradas en lugar de los IDs
    const descripcionesMostradas: DescripcionesMostradas = {
      idactividades: {},
      idlabores: {}
    };

    // Convertir los IDs en descripciones
    for (const idActividad in descripcionesEncontradas.idactividades) {
      const descripcion = descripcionesEncontradas.idactividades[idActividad];
      descripcionesMostradas.idactividades[idActividad] = descripcion;
    }

    for (const idLabor in descripcionesEncontradas.idlabores) {
      const descripcion = descripcionesEncontradas.idlabores[idLabor];
      descripcionesMostradas.idlabores[idLabor] = descripcion;
    }

    // Crear una nueva lista de detalles con las descripciones
    const listaDeDetallesConDescripciones = this.listaDeDetalles.map(detalle => ({
      item: detalle.item,
      idactividad: descripcionesMostradas.idactividades[detalle.idactividad] || detalle.idactividad,
      idlabor: descripcionesMostradas.idlabores[detalle.idlabor] || detalle.idlabor,
      cantidad: detalle.cantidad
    }));

    // Mostrar los resultados
    console.log('Datos mapeados:', jsonData);
    console.log('Descripciones encontradas:', descripcionesMostradas);

    // Asignar la nueva lista de detalles con descripciones a tu componente
    this.listaDeDetallesConDescripciones = listaDeDetallesConDescripciones;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  cambiarPagina(pagina: string) {
    if (this.paginaActual !== pagina) {
      this.paginaActual = pagina;
    }
  }

}

