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

  private cerrarSesion(): void {
    const usuarioLog = JSON.parse(localStorage.getItem('usuarioLog') || '{}') as UsuarioLog;
    const ip = usuarioLog?.ip;
    const usuarioLogOID = usuarioLog?.usuariosLogOID;

    if (usuarioLogOID && ip) {
      this.logOff(usuarioLogOID, ip).subscribe({
        next: () => {
          console.log('Sesión cerrada en backend correctamente.');
        },
        error: (err) => {
          console.error('Error al cerrar sesión en backend:', err);
        },
        complete: () => {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    } else {
      console.warn('No se encontró usuarioLog en localStorage. Redirigiendo.');
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  public logOff(usuarioLogOID: string, ip: string) {
    const url = GlobalConstants.apiURL + "account/logOff/" + usuarioLogOID + "/" + ip;
    return this.http.get<UsuarioLog>(url);
  }
}
