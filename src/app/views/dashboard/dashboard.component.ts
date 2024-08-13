import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usuario: Usuario;
  url:String;

  constructor() { 
   
  }

  ngOnInit(): void {
 
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.url = this.usuario.infoHuesped.publicadorReporte;
  }

}
