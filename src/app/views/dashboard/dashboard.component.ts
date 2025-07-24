import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usuario: Usuario;
  url: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    //const unsafeUrl = this.usuario.infoHuesped.publicadorReporte;
    //this.url = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);

    const unsafeUrl =  JSON.parse(localStorage.getItem('urlReporte'));
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }
}
