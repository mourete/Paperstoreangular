// src/app/services/idle.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../model/global-constants';
import { UsuarioLog } from '../model/usuario-log';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private timeoutInMs = 3 * 60 * 1000; // 3 minutos
  private userActivityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
  private activitySubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private zone: NgZone,
    private http: HttpClient
  ) {}

  startWatching(): void {
    this.zone.runOutsideAngular(() => {
      const events$ = merge(...this.userActivityEvents.map(event => fromEvent(document, event)));
      this.activitySubscription = events$
        .pipe(
          switchMapTo(timer(this.timeoutInMs))
        )
        .subscribe(() => this.zone.run(() => this.handleInactivity()));
    });
  }

  stopWatching(): void {
    this.activitySubscription.unsubscribe();
  }

  private handleInactivity(): void {
    console.log('Usuario inactivo. Cerrando sesión...');
    this.cerrarSesion();
  }

  public logOff (  usuarioLogOID: string , ip:string )  {
    let url:string = GlobalConstants.apiURL + "account/logOff/" + usuarioLogOID + "/" + ip;
    return this.http.get<UsuarioLog>( url  );
  
  }
  
  private cerrarSesion(): void {
    // Llama al backend para cerrar la base de datos
    this.http.post('/api/logout-db', {}).subscribe({
      next: () => {
        console.log('Base de datos cerrada correctamente.');
      },
      error: err => {
        console.error('Error al cerrar base de datos:', err);
      },
      complete: () => {
        // Limpiar sesión local y redirigir
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
