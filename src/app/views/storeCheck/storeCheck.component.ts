import { Component, OnInit } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-storeCheck',
  templateUrl: './storeCheck.component.html',
  styleUrls: ['./storeCheck.component.scss']
})
export class StoreCheckComponent implements OnInit {
  usuario: Usuario;
  url: SafeResourceUrl;


  constructor(private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
   //const unsafeUrl = this.usuario.infoHuesped.publicadorReporte;
   const unsafeUrl =  JSON.parse(localStorage.getItem('urlReporte'));
   this.url = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
   console.log("Url Reporte:" + this.url)
  }

}
